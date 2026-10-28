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
      enum: [
        'APPLIED',
        'PENDING',
        'UNDER_REVIEW',
        'SHORTLISTED',
        'INTERVIEW_SCHEDULED',
        'INTERVIEW',
        'HIRED',
        'ACCEPTED',
        'APPROVED',
        'REJECTED',
      ],
      default: 'APPLIED',
      index: true,
    },
    appliedMode: {
      type: String,
      enum: ['VOICE', 'ONE_CLICK', 'MANUAL'],
      default: 'ONE_CLICK',
    },
    jobLocation: {
      type: String,
      default: 'Bengaluru',
    },
    employerName: {
      type: String,
      default: 'Verified Employer',
    },
    interviewDate: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    interviewTime: {
      type: String,
      default: '',
    },
    interviewMode: {
      type: String,
      default: 'In Person',
    },
    interviewLocation: {
      type: String,
      default: '',
    },
    employerMessage: {
      type: String,
      default: '',
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
  // Ensure frontend component compatibility
  obj.jobLocation = obj.jobLocation || obj.jobId?.location || obj.location || 'Bengaluru';
  obj.location = obj.jobLocation;
  obj.category = obj.jobCategory || obj.applicantTrade || obj.jobId?.category || 'DRIVER';
  obj.dailyWage = obj.dailyWage || obj.expectedWage || obj.jobId?.dailyWage || 1200;
  obj.experience = obj.applicantExperience || '1+ Years';
  obj.voiceRecording = obj.voiceRecordingUrl || '';
  obj.applicationSource = obj.appliedMode || 'MANUAL';
  obj.applicationMethod = obj.appliedMode || 'MANUAL';
  obj.employerName = obj.employerName || obj.jobId?.employerName || obj.jobId?.companyName || 'Verified Employer';
  delete obj.__v;
  return obj;
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;
