import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// In-Memory Fallback Store (Ensures 100% reliability during offline/development mode when MongoDB Atlas connection is unreachable)
const fallbackUsers = [
  {
    id: 'demo_exec_01',
    fullName: 'David Sterling',
    email: 'executive@veriproof.com',
    passwordHash: bcrypt.hashSync('GoldStandard2026!', 10),
    role: 'candidate',
    company: 'Sterling Global Partners',
    headline: 'Chief Technology Officer | Ex-Google',
    experienceLevel: 'C-Suite',
    verificationStatus: 'elite_gold',
    trustScore: 98,
    lastLogin: new Date(),
  },
];

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'veriproof_gold_standard_corporate_jwt_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Please provide both corporate email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if MongoDB is connected
    const isMongoConnected = mongoose.connection.readyState === 1;

    let user = null;
    let isPasswordValid = false;
    let userPayload = null;

    if (isMongoConnected) {
      // 1. SMART LOOKUP: Check if user exists in MongoDB
      user = await User.findOne({ email: normalizedEmail }).select('+password');

      // 2. USER NOT FOUND: Return structured 404 with USER_NOT_FOUND code
      if (!user) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'Account not found. Redirecting to registration...',
          email: normalizedEmail,
          redirectTo: `/register?email=${encodeURIComponent(normalizedEmail)}`,
        });
      }

      // 3. USER FOUND: Validate password
      isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid password. Please check your credentials.',
        });
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      const token = user.generateAuthToken();

      return res.status(200).json({
        success: true,
        message: 'Authentication successful. Welcome to VeriProof Executive Suite.',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          headline: user.headline,
          company: user.company,
          experienceLevel: user.experienceLevel,
          verificationStatus: user.verificationStatus,
          trustScore: user.trustScore,
          lastLogin: user.lastLogin,
        },
      });
    } else {
      // Resilient In-Memory Fallback Mode
      const foundFallback = fallbackUsers.find((u) => u.email === normalizedEmail);

      // If user is NOT found in the database, return smart redirection response
      if (!foundFallback) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'Account not found. Redirecting to registration...',
          email: normalizedEmail,
          redirectTo: `/register?email=${encodeURIComponent(normalizedEmail)}`,
        });
      }

      // Check password
      isPasswordValid = await bcrypt.compare(password, foundFallback.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid password. Please check your credentials.',
        });
      }

      const token = generateToken({
        id: foundFallback.id,
        email: foundFallback.email,
        role: foundFallback.role,
        fullName: foundFallback.fullName,
        verificationStatus: foundFallback.verificationStatus,
      });

      return res.status(200).json({
        success: true,
        message: 'Authentication successful. Welcome to VeriProof Executive Suite.',
        token,
        user: {
          id: foundFallback.id,
          fullName: foundFallback.fullName,
          email: foundFallback.email,
          role: foundFallback.role,
          headline: foundFallback.headline,
          company: foundFallback.company,
          experienceLevel: foundFallback.experienceLevel,
          verificationStatus: foundFallback.verificationStatus,
          trustScore: foundFallback.trustScore,
        },
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Internal server error during authentication.',
    });
  }
};

/**
 * @desc    Check whether an email exists in MongoDB (Smart Pre-check)
 * @route   POST /api/auth/check-email
 * @access  Public
 */
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required for lookup.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isMongoConnected = mongoose.connection.readyState === 1;

    let exists = false;
    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail }).select('_id');
      exists = !!existingUser;
    } else {
      exists = fallbackUsers.some((u) => u.email === normalizedEmail);
    }

    return res.status(200).json({
      success: true,
      exists,
      email: normalizedEmail,
      message: exists
        ? 'Account identified in VeriProof database.'
        : 'Account not found. Redirecting to registration...',
    });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to query user database.',
    });
  }
};

/**
 * @desc    Register a new corporate user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role = 'candidate',
      company = '',
      headline = 'Verified Corporate Professional',
      experienceLevel = 'Senior Executive',
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        code: 'MISSING_FIELDS',
        message: 'Please provide full name, corporate email, and a secure password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          code: 'USER_ALREADY_EXISTS',
          message: 'A corporate account with this email already exists. Please log in.',
          email: normalizedEmail,
        });
      }

      const newUser = new User({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        role,
        company: company.trim(),
        headline: headline.trim(),
        experienceLevel,
        verificationStatus: 'verified',
        trustScore: 95,
      });

      await newUser.save();
      const token = newUser.generateAuthToken();

      return res.status(201).json({
        success: true,
        message: 'Executive registration successful. Welcome to VeriProof.',
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          headline: newUser.headline,
          company: newUser.company,
          experienceLevel: newUser.experienceLevel,
          verificationStatus: newUser.verificationStatus,
          trustScore: newUser.trustScore,
        },
      });
    } else {
      // In-Memory Fallback registration
      const existing = fallbackUsers.find((u) => u.email === normalizedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          code: 'USER_ALREADY_EXISTS',
          message: 'A corporate account with this email already exists. Please log in.',
          email: normalizedEmail,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newFallbackUser = {
        id: 'usr_' + Date.now(),
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        company: company.trim() || 'VeriProof Corporate Network',
        headline: headline.trim(),
        experienceLevel,
        verificationStatus: 'verified',
        trustScore: 95,
      };

      fallbackUsers.push(newFallbackUser);

      const token = generateToken({
        id: newFallbackUser.id,
        email: newFallbackUser.email,
        role: newFallbackUser.role,
        fullName: newFallbackUser.fullName,
        verificationStatus: newFallbackUser.verificationStatus,
      });

      return res.status(201).json({
        success: true,
        message: 'Executive registration successful. Welcome to VeriProof.',
        token,
        user: {
          id: newFallbackUser.id,
          fullName: newFallbackUser.fullName,
          email: newFallbackUser.email,
          role: newFallbackUser.role,
          headline: newFallbackUser.headline,
          company: newFallbackUser.company,
          experienceLevel: newFallbackUser.experienceLevel,
          verificationStatus: newFallbackUser.verificationStatus,
          trustScore: newFallbackUser.trustScore,
        },
      });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      code: 'REGISTRATION_ERROR',
      message: error.message || 'Failed to create user account.',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (JWT required)
 */
export const getProfile = async (req, res) => {
  try {
    const isMongoConnected = mongoose.connection.readyState === 1;

    if (isMongoConnected) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.status(200).json({ success: true, user });
    } else {
      const user = fallbackUsers.find((u) => u.id === req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      return res.status(200).json({ success: true, user });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
};
