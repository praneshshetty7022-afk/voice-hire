import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../../.users_db.json');

// Default initial seed users (Password: Password123)
const SEED_USERS = [
  {
    _id: '6651a1000000000000000001',
    name: 'Ramesh Kumar',
    fullName: 'Ramesh Kumar',
    email: 'worker@voicehire.com',
    password: '$2a$10$/DCCK4pAfZFDOi66WtjqueyaAdfXnNEl.7iB9V6idjeqBUYanbEBK',
    role: 'employee',
    phone: '9876543210',
    preferredLanguage: 'kn',
    location: 'Bengaluru',
    tradeCategory: 'DRIVER',
    skills: ['Heavy Vehicle', 'Commercial Cab', 'GPS Navigation'],
    experience: '3+ Years',
    expectedWage: 1200,
    wageType: 'daily',
    bio: 'Experienced city and highway driver with clean commercial track record.',
    verificationStatus: 'verified',
    trustScore: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6651a2000000000000000002',
    name: 'Priya Sharma',
    fullName: 'Priya Sharma',
    email: 'employer@voicehire.com',
    password: '$2a$10$/DCCK4pAfZFDOi66WtjqueyaAdfXnNEl.7iB9V6idjeqBUYanbEBK',
    role: 'employer',
    phone: '9123456780',
    preferredLanguage: 'en',
    location: 'Bengaluru',
    companyName: 'Nandi Logistics & Fleet Solutions',
    businessType: 'Logistics & Commercial',
    businessDescription: 'Leading supply chain & logistics company operating across Karnataka.',
    verificationStatus: 'verified',
    trustScore: 96,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let inMemoryUsers = [...SEED_USERS];

// Load persisted users from file if exists
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryUsers = parsed;
    }
  }
} catch (e) {
  // Silent fallback to inMemoryUsers
}

// Persist users to disk
const saveToDisk = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryUsers, null, 2), 'utf-8');
  } catch (e) {
    // Ignore if running in a read-only environment
  }
};

/**
 * Attach Mongoose-compatible helper methods to a raw user object
 */
export const wrapFallbackUser = (rawUser) => {
  if (!rawUser) return null;

  const user = { ...rawUser };

  user.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };

  user.generateAuthToken = function () {
    const secret = process.env.JWT_SECRET || 'voicehire_super_secret_jwt_key_2026_udyoga_mitra_platform_secure_token';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
        name: this.name,
      },
      secret,
      { expiresIn }
    );
  };

  user.toJSON = function () {
    const copy = { ...this };
    delete copy.password;
    delete copy.comparePassword;
    delete copy.generateAuthToken;
    delete copy.toJSON;
    delete copy.save;
    return copy;
  };

  user.save = async function () {
    const idx = inMemoryUsers.findIndex((u) => String(u._id) === String(this._id));
    this.updatedAt = new Date().toISOString();
    if (idx !== -1) {
      inMemoryUsers[idx] = { ...this };
    } else {
      inMemoryUsers.push({ ...this });
    }
    saveToDisk();
    return this;
  };

  return user;
};

/**
 * Find user in fallback store by email
 */
export const findFallbackUserByEmail = (email) => {
  if (!email) return null;
  const clean = String(email).trim().toLowerCase();
  const found = inMemoryUsers.find((u) => String(u.email).toLowerCase() === clean);
  return wrapFallbackUser(found);
};

/**
 * Find user in fallback store by ID
 */
export const findFallbackUserById = (id) => {
  if (!id) return null;
  const found = inMemoryUsers.find((u) => String(u._id) === String(id));
  return wrapFallbackUser(found);
};

/**
 * Create a new user in fallback store
 */
export const createFallbackUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newId = new mongoose.Types.ObjectId().toString();

  const newUserRaw = {
    _id: newId,
    name: userData.name,
    fullName: userData.name,
    email: String(userData.email).trim().toLowerCase(),
    password: hashedPassword,
    role: userData.role || 'employee',
    phone: String(userData.phone || '').trim(),
    preferredLanguage: userData.preferredLanguage || 'en',
    location: userData.location || 'Bengaluru',
    tradeCategory: (userData.tradeCategory || 'DRIVER').toUpperCase(),
    skills: Array.isArray(userData.skills) ? userData.skills : [],
    experience: userData.experience || '1-3 Years',
    expectedWage: Number(userData.expectedWage) || 1000,
    wageType: userData.wageType || 'daily',
    bio: userData.bio || '',
    companyName: userData.role === 'employer' ? (userData.companyName || `${userData.name}'s Enterprise`) : '',
    businessType: userData.role === 'employer' ? (userData.businessType || 'Logistics & Commercial') : '',
    businessDescription: userData.businessDescription || '',
    verificationStatus: 'verified',
    trustScore: 95,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryUsers.push(newUserRaw);
  saveToDisk();

  return wrapFallbackUser(newUserRaw);
};

/**
 * Update an existing user in fallback store
 */
export const updateFallbackUser = (id, updates) => {
  const idx = inMemoryUsers.findIndex((u) => String(u._id) === String(id));
  if (idx === -1) return null;

  const current = inMemoryUsers[idx];
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.name) updated.fullName = updates.name;
  if (updates.fullName) updated.name = updates.fullName;

  inMemoryUsers[idx] = updated;
  saveToDisk();

  return wrapFallbackUser(updated);
};
