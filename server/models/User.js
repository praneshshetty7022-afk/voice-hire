import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['employee', 'employer'],
      required: [true, 'Role must be employee or employer'],
      default: 'employee',
      lowercase: true,
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

// Virtual alias to support both phone and phoneNumber
userSchema.virtual('phoneNumber').get(function () {
  return this.phone;
});
userSchema.virtual('phoneNumber').set(function (val) {
  this.phone = val;
});

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'voicehire_secure_corporate_platform_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign(
    {
      id: this._id,
      phone: this.phone,
      role: this.role,
      fullName: this.fullName,
    },
    secret,
    { expiresIn }
  );
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
