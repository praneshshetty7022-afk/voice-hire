import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [80, 'Full name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Corporate email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid corporate email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'corporate_admin'],
      default: 'candidate',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    headline: {
      type: String,
      trim: true,
      default: 'Verified Corporate Professional',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid-Level', 'Senior Executive', 'Director / VP', 'C-Suite'],
      default: 'Senior Executive',
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'elite_gold'],
      default: 'verified',
    },
    trustScore: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
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

// Hash password before saving
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

// Compare password instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token instance method
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'veriproof_gold_standard_corporate_jwt_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      fullName: this.fullName,
      verificationStatus: this.verificationStatus,
    },
    secret,
    { expiresIn }
  );
};

// Clean JSON representation
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
