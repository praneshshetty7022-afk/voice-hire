import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Worker name is required / नाम आवश्यक है'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required / फ़ोन नंबर आवश्यक है'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      required: false, // Password completely optional / not required
      select: false,
    },
    workType: {
      type: String,
      enum: ['Driver', 'Cook', 'Househelp', 'Delivery', 'Helper', 'Security', 'Electrician', 'Carpenter', 'Worker', 'Other'],
      default: 'Driver',
    },
    city: {
      type: String,
      default: 'Bengaluru',
    },
    preferredLanguage: {
      type: String,
      default: 'hi-IN',
    },
    role: {
      type: String,
      enum: ['WORKER', 'EMPLOYER', 'ADMIN', 'candidate'],
      default: 'WORKER',
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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password only if one was provided
userSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) {
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

// Compare password/PIN (if no password set on account, allow phone login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return true;
  if (!candidatePassword) return true;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET || 'udyoga_mitra_gold_worker_jwt_secret_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign(
    {
      id: this._id,
      phoneNumber: this.phoneNumber,
      fullName: this.fullName,
      workType: this.workType,
      role: this.role,
    },
    secret,
    { expiresIn }
  );
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
