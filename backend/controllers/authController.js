import mongoose from 'mongoose';
import User from '../models/User.js';

// Normalize email helper
const normalizeEmail = (email) => {
  if (!email) return '';
  return String(email).trim().toLowerCase();
};

/**
 * @desc    Register a new user (employee or employer)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      fullName,
      email,
      password,
      role = 'employee',
      phone = '',
      preferredLanguage = 'en',
      location = 'Bengaluru',
      tradeCategory = 'DRIVER',
      skills = [],
      experience = '1-3 Years',
      expectedWage = 1000,
      wageType = 'daily',
      bio = '',
      companyName = '',
      businessType = 'Logistics & Commercial',
      businessDescription = '',
    } = req.body;

    const resolvedName = (name || fullName || '').trim();
    const cleanEmail = normalizeEmail(email);

    // 1. Input Validation
    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
      });
    }

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const validRole = role.toLowerCase() === 'employer' ? 'employer' : 'employee';

    // 2. Database Connectivity Check
    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please verify MONGO_URI in server configuration.',
      });
    }

    // 3. Duplicate Email Check -> 409 Conflict
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // 4. Create and Save New User (password hashed via pre-save hook)
    const newUser = new User({
      name: resolvedName,
      email: cleanEmail,
      password,
      role: validRole,
      phone: String(phone || '').trim(),
      preferredLanguage,
      location,
      tradeCategory: tradeCategory.toUpperCase(),
      skills: Array.isArray(skills) ? skills : [],
      experience,
      expectedWage: Number(expectedWage) || 1000,
      wageType,
      bio,
      companyName: validRole === 'employer' ? (companyName.trim() || `${resolvedName}'s Enterprise`) : '',
      businessType: validRole === 'employer' ? businessType : '',
      businessDescription: validRole === 'employer' ? businessDescription : '',
    });

    await newUser.save();

    // 5. Generate JWT Token
    const token = newUser.generateAuthToken();

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to VoiceHire.',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Login with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);

    // 1. Basic validation
    if (!cleanEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // 2. Database Connectivity Check
    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please verify MONGO_URI in server configuration.',
      });
    }

    // 3. Look up user by email, explicitly including password field
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    // 4. Generic 401 if user does not exist or password does not match
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 5. Strict Role Isolation: An account registered for one role cannot log in through the other portal
    if (role) {
      const requestedRole = String(role).trim().toLowerCase();
      const userRole = String(user.role).trim().toLowerCase();
      if (userRole !== requestedRole) {
        const userLabel = userRole === 'employer' ? 'an Employer' : 'a Worker';
        const targetLabel = requestedRole === 'employer' ? 'Employer' : 'Worker';
        return res.status(403).json({
          success: false,
          roleMismatch: true,
          actualRole: userRole,
          message: `Role mismatch: This account is registered as ${userLabel}. You cannot log in through the ${targetLabel} portal with these credentials.`,
        });
      }
    }

    // 6. Update lastLogin and generate JWT
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.',
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching profile.',
    });
  }
};

/**
 * @desc    Update authenticated user profile
 * @route   PUT /api/auth/profile
 * @access  Private (Protected by authMiddleware)
 */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please log in.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database.',
      });
    }

    const updates = req.body;

    // Update common allowed fields
    const allowedCommon = ['name', 'fullName', 'phone', 'preferredLanguage', 'location'];
    const allowedEmployee = ['tradeCategory', 'skills', 'experience', 'expectedWage', 'wageType', 'bio'];
    const allowedEmployer = ['companyName', 'businessType', 'businessDescription'];

    allowedCommon.forEach((field) => {
      if (updates[field] !== undefined) {
        if (field === 'fullName') {
          user.name = updates[field].trim();
        } else if (field === 'name') {
          user.name = updates[field].trim();
        } else {
          user[field] = updates[field];
        }
      }
    });

    if (user.role === 'employee') {
      allowedEmployee.forEach((field) => {
        if (updates[field] !== undefined) user[field] = updates[field];
      });
    } else if (user.role === 'employer') {
      allowedEmployer.forEach((field) => {
        if (updates[field] !== undefined) user[field] = updates[field];
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile.',
    });
  }
};

export default { register, login, getProfile, updateProfile };
