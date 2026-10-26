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
      trim: true,
      index: true,
      sparse: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'PIN or password is required / पिन या पासवर्ड आवश्यक है'],
      minlength: [4, 'PIN/Password must be at least 4 digits/characters'],
      select: false,
    },
    workType: {
      type: String,
      enum: ['Driver', 'Cook', 'Househelp', 'Delivery', 'Helper', 'Security', 'Electrician', 'Carpenter', 'Worker', 'Other'],
      default: 'Worker',
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

// Hash PIN/password before saving
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

// Compare password/PIN instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
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
      email: this.email,
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
