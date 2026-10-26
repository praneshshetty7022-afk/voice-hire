import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employerName: {
      type: String,
      default: 'Verified Employer',
      trim: true,
    },
    companyName: {
      type: String,
      default: 'VoiceHire Partner',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      uppercase: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Job location / city is required'],
      trim: true,
    },
    workTime: {
      type: String,
      default: '9:00 AM – 6:00 PM',
    },
    experience: {
      type: String,
      default: '1+ Years',
    },
    dailyWage: {
      type: Number,
      required: true,
      default: 1000,
    },
    minWage: {
      type: Number,
      default: 900,
    },
    maxWage: {
      type: Number,
      default: 1300,
    },
    salaryType: {
      type: String,
      enum: ['Daily', 'Monthly'],
      default: 'Daily',
    },
    description: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: ['Valid ID Proof', 'Basic trade experience', 'Good communication'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CLOSED'],
      default: 'ACTIVE',
      index: true,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj.__v;
  return obj;
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
