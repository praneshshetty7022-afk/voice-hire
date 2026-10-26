import mongoose from 'mongoose';
import User from '../models/User.js';

// Clean and normalize 10-digit Indian phone number
const normalizePhone = (p) => {
  if (!p) return '';
  return String(p).replace(/\D/g, '').slice(-10);
};

/**
 * @desc    Register a new user (employee or employer)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      phoneNumber,
      role = 'employee',
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

    const rawPhone = phone || phoneNumber;
    if (!fullName || !rawPhone) {
      return res.status(400).json({
        success: false,
        message: 'Full Name and Phone Number are required.',
      });
    }

    const cleanPhone = normalizePhone(rawPhone);
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.',
      });
    }

    const validRole = role.toLowerCase() === 'employer' ? 'employer' : 'employee';

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let existing = await User.findOne({ phone: cleanPhone });

      if (existing) {
        existing.fullName = fullName.trim();
        existing.role = validRole;
        existing.preferredLanguage = preferredLanguage;
        existing.location = location;
        if (validRole === 'employee') {
          existing.tradeCategory = tradeCategory.toUpperCase();
          if (skills.length) existing.skills = skills;
          if (experience) existing.experience = experience;
          if (expectedWage) existing.expectedWage = Number(expectedWage);
          if (wageType) existing.wageType = wageType;
          if (bio) existing.bio = bio;
        } else {
          existing.companyName = companyName.trim() || `${fullName}'s Enterprise`;
          existing.businessType = businessType;
          if (businessDescription) existing.businessDescription = businessDescription;
        }
        existing.lastLogin = new Date();
        await existing.save();

        const token = existing.generateAuthToken();
        return res.status(200).json({
          success: true,
          message: `Welcome back, ${existing.fullName}!`,
          token,
          user: existing.toJSON(),
        });
      }

      const newUser = new User({
        fullName: fullName.trim(),
        phone: cleanPhone,
        role: validRole,
        preferredLanguage,
        location,
        tradeCategory: tradeCategory.toUpperCase(),
        skills: Array.isArray(skills) ? skills : [],
        experience,
        expectedWage: Number(expectedWage) || 1000,
        wageType,
        bio,
        companyName: validRole === 'employer' ? (companyName.trim() || `${fullName}'s Enterprise`) : '',
        businessType: validRole === 'employer' ? businessType : '',
        businessDescription: validRole === 'employer' ? businessDescription : '',
      });

      await newUser.save();
      const token = newUser.generateAuthToken();

      return res.status(201).json({
        success: true,
        message: 'Profile created successfully.',
        token,
        user: newUser.toJSON(),
      });
    }

    // In-memory resilient response if MongoDB is offline in dev
    const fallbackUser = {
      _id: 'usr_' + Date.now(),
      id: 'usr_' + Date.now(),
      fullName: fullName.trim(),
      phone: cleanPhone,
      phoneNumber: cleanPhone,
      role: validRole,
      preferredLanguage,
      location,
      tradeCategory: tradeCategory.toUpperCase(),
      skills: Array.isArray(skills) ? skills : [],
      experience,
      expectedWage: Number(expectedWage) || 1000,
      wageType,
      bio,
      companyName: validRole === 'employer' ? (companyName.trim() || `${fullName}'s Enterprise`) : '',
      businessType,
      verificationStatus: 'verified',
      trustScore: 98,
    };

    const token = new User(fallbackUser).generateAuthToken();

    return res.status(201).json({
      success: true,
      message: 'Profile initialized successfully.',
      token,
      user: fallbackUser,
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

/**
 * @desc    Login with phone number and role selection
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { phone, phoneNumber, role = 'employee' } = req.body;
    const rawPhone = phone || phoneNumber;

    if (!rawPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your 10-digit mobile number.',
      });
    }

    const cleanPhone = normalizePhone(rawPhone);
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.',
      });
    }

    const requestedRole = role.toLowerCase() === 'employer' ? 'employer' : 'employee';
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let user = await User.findOne({ phone: cleanPhone });

      if (user) {
        // Update role if explicitly selected or keep existing
        if (user.role !== requestedRole) {
          user.role = requestedRole;
        }
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const token = user.generateAuthToken();
        return res.status(200).json({
          success: true,
          message: `Welcome back, ${user.fullName}!`,
          token,
          user: user.toJSON(),
        });
      }

      // If phone is new, automatically register frictionless worker/employer account
      const defaultName = requestedRole === 'employer' ? 'Hiring Manager' : 'Verified Worker';
      const autoUser = new User({
        fullName: defaultName,
        phone: cleanPhone,
        role: requestedRole,
        companyName: requestedRole === 'employer' ? 'VoiceHire Partner' : '',
      });

      await autoUser.save();
      const token = autoUser.generateAuthToken();

      return res.status(200).json({
        success: true,
        message: `Welcome to VoiceHire! Profile created.`,
        token,
        user: autoUser.toJSON(),
      });
    }

    // Resilient fallback
    const fallbackUser = {
      _id: 'usr_' + cleanPhone,
      id: 'usr_' + cleanPhone,
      fullName: requestedRole === 'employer' ? 'Nandi Logistics' : 'Ramesh Kumar',
      phone: cleanPhone,
      phoneNumber: cleanPhone,
      role: requestedRole,
      companyName: requestedRole === 'employer' ? 'Nandi Logistics & Motors' : '',
      tradeCategory: 'DRIVER',
      location: 'Bengaluru',
      verificationStatus: 'verified',
      trustScore: 98,
    };

    const token = new User(fallbackUser).generateAuthToken();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: fallbackUser,
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
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && req.user?._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.status(200).json({
          success: true,
          user: user.toJSON(),
        });
      }
    }

    return res.status(200).json({
      success: true,
      user: req.user,
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
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const updates = req.body;

    if (isDbConnected && req.user?._id) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found in database.' });
      }

      // Update allowed fields based on role
      const allowedCommon = ['fullName', 'preferredLanguage', 'location'];
      const allowedEmployee = ['tradeCategory', 'skills', 'experience', 'expectedWage', 'wageType', 'bio'];
      const allowedEmployer = ['companyName', 'businessType', 'businessDescription'];

      allowedCommon.forEach((field) => {
        if (updates[field] !== undefined) user[field] = updates[field];
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
        message: 'Profile updated successfully in MongoDB.',
        user: user.toJSON(),
      });
    }

    // In-memory fallback response
    const updated = {
      ...req.user,
      ...updates,
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated,
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
