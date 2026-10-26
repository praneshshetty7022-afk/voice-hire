import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Pre-seeded verified worker accounts for low-literacy testing
const fallbackUsers = [
  {
    id: 'worker_demo_01',
    fullName: 'Ramesh Kumar (रमेश कुमार)',
    phoneNumber: '9876543210',
    email: 'ramesh@udyoga.com',
    passwordHash: bcrypt.hashSync('1234', 10), // Easy 4-digit PIN
    workType: 'Driver',
    city: 'Bengaluru',
    role: 'WORKER',
    verificationStatus: 'verified',
    trustScore: 96,
  },
  {
    id: 'worker_demo_02',
    fullName: 'Sunita Devi (सुनीता देवी)',
    phoneNumber: '9123456780',
    email: 'sunita@udyoga.com',
    passwordHash: bcrypt.hashSync('1234', 10),
    workType: 'Cook',
    city: 'Bengaluru',
    role: 'WORKER',
    verificationStatus: 'verified',
    trustScore: 98,
  },
];

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'udyoga_mitra_gold_worker_jwt_secret_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * @desc    Authenticate worker by Mobile Number or Email & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { identifier, phoneNumber, email, password } = req.body;

    const rawInput = (phoneNumber || email || identifier || '').trim();
    if (!rawInput || !password) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'कृपया अपना फ़ोन नंबर और पिन/पासवर्ड दर्ज करें (Please enter phone number and PIN).',
      });
    }

    // Determine if input is a 10-digit phone number or email
    const digitsOnly = rawInput.replace(/\D/g, '');
    const isPhone = digitsOnly.length >= 10;
    const cleanPhone = isPhone ? digitsOnly.slice(-10) : '';
    const cleanEmail = !isPhone && rawInput.includes('@') ? rawInput.toLowerCase() : '';

    const isMongoConnected = mongoose.connection.readyState === 1;

    let user = null;
    let isPasswordValid = false;

    if (isMongoConnected) {
      // 1. SMART LOOKUP: Check if worker exists by Phone or Email
      const query = [];
      if (cleanPhone) query.push({ phoneNumber: cleanPhone });
      if (cleanEmail) query.push({ email: cleanEmail });
      if (query.length === 0) query.push({ email: rawInput.toLowerCase() });

      user = await User.findOne({ $or: query }).select('+password');

      // 2. WORKER NOT FOUND: Return 404 with USER_NOT_FOUND code and pre-fill details
      if (!user) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'खाता नहीं मिला। आइए नया पंजीकरण करें! (Account not found. Let us register you!)',
          phoneNumber: cleanPhone,
          email: cleanEmail,
          identifier: rawInput,
          redirectTo: `/register?phone=${encodeURIComponent(cleanPhone || rawInput)}`,
        });
      }

      // 3. WORKER FOUND: Validate PIN / Password
      isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'गलत पिन या पासवर्ड। कृपया पुनः प्रयास करें (Invalid PIN or password. Try again).',
        });
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      const token = user.generateAuthToken();

      return res.status(200).json({
        success: true,
        message: `स्वागत है, ${user.fullName}! लॉगिन सफल रहा (Login successful).`,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          email: user.email,
          workType: user.workType,
          city: user.city,
          role: user.role,
          verificationStatus: user.verificationStatus,
          trustScore: user.trustScore,
        },
      });
    } else {
      // Fallback in-memory mode for offline resilience
      const foundFallback = fallbackUsers.find(
        (u) =>
          (cleanPhone && u.phoneNumber === cleanPhone) ||
          (cleanEmail && u.email?.toLowerCase() === cleanEmail) ||
          u.phoneNumber === rawInput
      );

      if (!foundFallback) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'खाता नहीं मिला। आइए नया पंजीकरण करें! (Account not found. Let us register you!)',
          phoneNumber: cleanPhone,
          email: cleanEmail,
          identifier: rawInput,
          redirectTo: `/register?phone=${encodeURIComponent(cleanPhone || rawInput)}`,
        });
      }

      isPasswordValid = await bcrypt.compare(password, foundFallback.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'गलत पिन या पासवर्ड। कृपया पुनः प्रयास करें (Invalid PIN or password).',
        });
      }

      const token = generateToken({
        id: foundFallback.id,
        phoneNumber: foundFallback.phoneNumber,
        email: foundFallback.email,
        fullName: foundFallback.fullName,
        workType: foundFallback.workType,
        role: foundFallback.role,
      });

      return res.status(200).json({
        success: true,
        message: `स्वागत है, ${foundFallback.fullName}! लॉगिन सफल रहा (Login successful).`,
        token,
        user: {
          id: foundFallback.id,
          fullName: foundFallback.fullName,
          phoneNumber: foundFallback.phoneNumber,
          email: foundFallback.email,
          workType: foundFallback.workType,
          city: foundFallback.city,
          role: foundFallback.role,
          verificationStatus: foundFallback.verificationStatus,
          trustScore: foundFallback.trustScore,
        },
      });
    }
  } catch (error) {
    console.error('Error during worker login:', error);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'सर्वर त्रुटि। कृपया पुनः प्रयास करें (Server error during login).',
    });
  }
};

/**
 * @desc    Check whether a phone number or email is registered
 * @route   POST /api/auth/check-email
 * @access  Public
 */
export const checkEmail = async (req, res) => {
  try {
    const { identifier, phoneNumber, email } = req.body;
    const rawInput = (phoneNumber || email || identifier || '').trim();
    const digitsOnly = rawInput.replace(/\D/g, '');
    const cleanPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : '';

    const isMongoConnected = mongoose.connection.readyState === 1;
    let exists = false;

    if (isMongoConnected) {
      const query = [];
      if (cleanPhone) query.push({ phoneNumber: cleanPhone });
      if (rawInput.includes('@')) query.push({ email: rawInput.toLowerCase() });
      if (query.length === 0) query.push({ phoneNumber: rawInput });

      const found = await User.findOne({ $or: query }).select('_id');
      exists = !!found;
    } else {
      exists = fallbackUsers.some(
        (u) => (cleanPhone && u.phoneNumber === cleanPhone) || u.email === rawInput.toLowerCase()
      );
    }

    return res.status(200).json({
      success: true,
      exists,
      identifier: rawInput,
      message: exists
        ? 'खाता पंजीकृत है (Account registered).'
        : 'खाता नहीं मिला। आइए पंजीकरण करें (Account not found. Redirecting to registration...).',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Check failed.' });
  }
};

/**
 * @desc    Register a new low-literacy worker
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      password,
      workType = 'Worker',
      city = 'Bengaluru',
      preferredLanguage = 'hi-IN',
    } = req.body;

    if (!fullName || (!phoneNumber && !email) || !password) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'कृपया नाम, मोबाइल नंबर और पिन दर्ज करें (Please provide name, phone and PIN).',
      });
    }

    const cleanPhone = phoneNumber ? phoneNumber.replace(/\D/g, '').slice(-10) : '';
    const cleanEmail = email ? email.trim().toLowerCase() : (cleanPhone ? `${cleanPhone}@worker.udyoga.com` : '');

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Check duplicate
      const query = [];
      if (cleanPhone) query.push({ phoneNumber: cleanPhone });
      if (cleanEmail) query.push({ email: cleanEmail });

      const existing = await User.findOne({ $or: query });
      if (existing) {
        return res.status(409).json({
          success: false,
          code: 'USER_ALREADY_EXISTS',
          message: 'यह नंबर पहले से पंजीकृत है। कृपया लॉगिन करें (Already registered. Please login).',
        });
      }

      const newUser = new User({
        fullName: fullName.trim(),
        phoneNumber: cleanPhone || undefined,
        email: cleanEmail,
        password,
        workType,
        city,
        preferredLanguage,
        role: 'WORKER',
        verificationStatus: 'verified',
        trustScore: 95,
      });

      await newUser.save();
      const token = newUser.generateAuthToken();

      return res.status(201).json({
        success: true,
        message: `बधाई हो, ${newUser.fullName}! आपका पंजीकरण सफल रहा (Registration completed).`,
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
          workType: newUser.workType,
          city: newUser.city,
          role: newUser.role,
          verificationStatus: newUser.verificationStatus,
          trustScore: newUser.trustScore,
        },
      });
    } else {
      // In-Memory Fallback
      const existing = fallbackUsers.find(
        (u) => (cleanPhone && u.phoneNumber === cleanPhone) || (cleanEmail && u.email === cleanEmail)
      );

      if (existing) {
        return res.status(409).json({
          success: false,
          code: 'USER_ALREADY_EXISTS',
          message: 'यह नंबर पहले से पंजीकृत है। कृपया लॉगिन करें (Already registered. Please login).',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newWorker = {
        id: 'worker_' + Date.now(),
        fullName: fullName.trim(),
        phoneNumber: cleanPhone || '9800000000',
        email: cleanEmail,
        passwordHash,
        workType,
        city,
        role: 'WORKER',
        verificationStatus: 'verified',
        trustScore: 95,
      };

      fallbackUsers.push(newWorker);

      const token = generateToken({
        id: newWorker.id,
        phoneNumber: newWorker.phoneNumber,
        email: newWorker.email,
        fullName: newWorker.fullName,
        workType: newWorker.workType,
        role: newWorker.role,
      });

      return res.status(201).json({
        success: true,
        message: `बधाई हो, ${newWorker.fullName}! आपका पंजीकरण सफल रहा (Registration completed).`,
        token,
        user: {
          id: newWorker.id,
          fullName: newWorker.fullName,
          phoneNumber: newWorker.phoneNumber,
          email: newWorker.email,
          workType: newWorker.workType,
          city: newWorker.city,
          role: newWorker.role,
          verificationStatus: newWorker.verificationStatus,
          trustScore: newWorker.trustScore,
        },
      });
    }
  } catch (error) {
    console.error('Error during worker registration:', error);
    return res.status(500).json({
      success: false,
      code: 'REGISTRATION_ERROR',
      message: error.message || 'पंजीकरण विफल (Registration failed).',
    });
  }
};

/**
 * @desc    Get current authenticated profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'Worker not found.' });
      return res.status(200).json({ success: true, user });
    } else {
      const user = fallbackUsers.find((u) => u.id === req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'Worker not found.' });
      return res.status(200).json({ success: true, user });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
