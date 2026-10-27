import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: ['employee', 'employer'],
      required: [true, 'Role must be employee or employer'],
      default: 'employee',
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    location: {
      type: String,
      default: 'Bengaluru',
      trim: true,
    },
    // Employee Specific Profile Fields
    tradeCategory: {
      type: String,
      default: 'DRIVER',
      uppercase: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      default: '1-3 Years',
    },
    expectedWage: {
      type: Number,
      default: 1000,
    },
    wageType: {
      type: String,
      enum: ['daily', 'monthly'],
      default: 'daily',
    },
    bio: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['verified', 'pending', 'elite_gold'],
      default: 'verified',
    },
    trustScore: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
    },
    // Employer Specific Profile Fields
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
    businessType: {
      type: String,
      default: 'Logistics & Commercial',
      trim: true,
    },
    businessDescription: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual alias: fullName maps to name
userSchema.virtual('fullName').get(function () {
  return this.name;
});
userSchema.virtual('fullName').set(function (val) {
  this.name = val;
});

// Pre-save hook: Hash password with bcrypt before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method: Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method: Generate JWT auth token
userSchema.methods.generateAuthToken = function () {
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

// toJSON transform: Never leak password hash or __v
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
