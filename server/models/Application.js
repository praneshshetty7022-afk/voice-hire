import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantPhone: {
      type: String,
      required: true,
    },
    applicantTrade: {
      type: String,
      default: 'GENERAL',
    },
    applicantExperience: {
      type: String,
      default: '1+ Years',
    },
    expectedWage: {
      type: Number,
      default: 1000,
    },
    voiceRecordingUrl: {
      type: String,
      default: '',
    },
    voiceTranscript: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED'],
      default: 'APPLIED',
      index: true,
    },
    appliedMode: {
      type: String,
      enum: ['VOICE', 'ONE_CLICK', 'MANUAL'],
      default: 'ONE_CLICK',
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    employerNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj.__v;
  return obj;
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;
