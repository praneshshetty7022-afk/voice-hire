import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Pre-seeded verified worker accounts for testing
const fallbackUsers = [
  {
    id: 'worker_demo_01',
    fullName: 'Ramesh Kumar (रमेश कुमार)',
    phoneNumber: '9876543210',
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
 * @desc    Register a new worker with ONLY Name and Phone Number
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      workType = 'Driver',
      city = 'Bengaluru',
      preferredLanguage = 'hi-IN',
    } = req.body;

    // ONLY Name and Phone Number are required
    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'कृपया अपना नाम और मोबाइल नंबर दर्ज करें (Please provide Name and Phone Number).',
      });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_PHONE',
        message: 'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें (Please enter a valid 10-digit phone number).',
      });
    }

    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      // Check if phone number already exists
      const existing = await User.findOne({ phoneNumber: cleanPhone });
      if (existing) {
        return res.status(409).json({
          success: false,
          code: 'USER_ALREADY_EXISTS',
          message: 'यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें (Phone number already registered. Please login).',
          phoneNumber: cleanPhone,
        });
      }

      // Create new worker record with ONLY Name and Phone Number
      const newUser = new User({
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
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
          workType: newUser.workType,
          city: newUser.city,
          role: newUser.role,
          verificationStatus: newUser.verificationStatus,
          trustScore: newUser.trustScore,
        },
      });
    } else {
      // In-Memory Resilient Fallback Mode
      const existing = fallbackUsers.find((u) => u.phoneNumber === cleanPhone);
      if (existing) {
        return res.status(409).json({
          success: false,
          code: 'USER_ALREADY_EXISTS',
          message: 'यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें (Already registered. Please login).',
          phoneNumber: cleanPhone,
        });
      }

      const newWorker = {
        id: 'worker_' + Date.now(),
        fullName: fullName.trim(),
        phoneNumber: cleanPhone,
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
        fullName: newWorker.fullName,
        workType: newWorker.workType,
        role: newWorker.role,
      });

      return res.status(201).json({
        success: true,
        message: `बधाई हो, ${newWorker.fullName}! आपका पंजीकरण सफल रहा (Registration completed).`,
        token,
        user: newWorker,
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
 * @desc    Authenticate worker by Mobile Number & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { phoneNumber, identifier } = req.body;
    const rawInput = (phoneNumber || identifier || '').trim();

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'कृपया अपना मोबाइल नंबर दर्ज करें (Please enter phone number).',
      });
    }

    const cleanPhone = rawInput.replace(/\D/g, '').slice(-10);
    const isMongoConnected = mongoose.connection.readyState === 1;

    let user = null;

    if (isMongoConnected) {
      // 1. SMART LOOKUP: Check if phone number exists in MongoDB
      user = await User.findOne({ phoneNumber: cleanPhone });

      // 2. USER NOT FOUND: Return 404 with pre-fill details for Register redirection
      if (!user) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'खाता नहीं मिला। आइए नया पंजीकरण करें! (Account not found. Let us register you!)',
          phoneNumber: cleanPhone,
          redirectTo: `/register?phone=${encodeURIComponent(cleanPhone)}`,
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
          workType: user.workType,
          city: user.city,
          role: user.role,
          verificationStatus: user.verificationStatus,
          trustScore: user.trustScore,
        },
      });
    } else {
      // In-Memory Fallback
      const foundFallback = fallbackUsers.find((u) => u.phoneNumber === cleanPhone);

      if (!foundFallback) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'खाता नहीं मिला। आइए नया पंजीकरण करें! (Account not found. Let us register you!)',
          phoneNumber: cleanPhone,
          redirectTo: `/register?phone=${encodeURIComponent(cleanPhone)}`,
        });
      }

      const token = generateToken({
        id: foundFallback.id,
        phoneNumber: foundFallback.phoneNumber,
        fullName: foundFallback.fullName,
        workType: foundFallback.workType,
        role: foundFallback.role,
      });

      return res.status(200).json({
        success: true,
        message: `स्वागत है, ${foundFallback.fullName}! लॉगिन सफल रहा (Login successful).`,
        token,
        user: foundFallback,
      });
    }
  } catch (error) {
    console.error('Error during worker login:', error);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'सर्वर त्रुटि (Server error during login).',
    });
  }
};

/**
 * @desc    Check whether a phone number is registered
 * @route   POST /api/auth/check-phone (or /api/auth/check-email)
 * @access  Public
 */
export const checkPhone = async (req, res) => {
  try {
    const { phoneNumber, identifier } = req.body;
    const rawInput = (phoneNumber || identifier || '').trim();
    const cleanPhone = rawInput.replace(/\D/g, '').slice(-10);

    const isMongoConnected = mongoose.connection.readyState === 1;
    let exists = false;

    if (isMongoConnected) {
      const found = await User.findOne({ phoneNumber: cleanPhone }).select('_id');
      exists = !!found;
    } else {
      exists = fallbackUsers.some((u) => u.phoneNumber === cleanPhone);
    }

    return res.status(200).json({
      success: true,
      exists,
      phoneNumber: cleanPhone,
      message: exists ? 'नंबर पंजीकृत है' : 'नंबर पंजीकृत नहीं है',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Check failed' });
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

export const checkEmail = checkPhone;
