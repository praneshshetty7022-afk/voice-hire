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
  let resolvedCat = obj.jobCategory || obj.applicantTrade || obj.jobId?.category;
  const titleToCheck = obj.jobTitle || obj.jobId?.title || '';
  if (!resolvedCat || resolvedCat === 'DRIVER') {
    if (/electr|wireman|बिजली|ವಿದ್ಯುತ್/i.test(titleToCheck)) resolvedCat = 'ELECTRICIAN';
    else if (/plumb|pipe|नल|ಪ್ಲಂಬರ್/i.test(titleToCheck)) resolvedCat = 'PLUMBER';
    else if (/carpent|wood|बढ़ई|ಬಡಗಿ/i.test(titleToCheck)) resolvedCat = 'CARPENTER';
    else if (/cook|chef|kitchen|रसोइया|ಅಡುಗೆ/i.test(titleToCheck)) resolvedCat = 'COOK';
    else if (/paint|पुताई|ಪೇಂಟರ್/i.test(titleToCheck)) resolvedCat = 'PAINTER';
    else if (/welder|fabricat|वेल्डर|ವೆಲ್ಡರ್/i.test(titleToCheck)) resolvedCat = 'WELDER';
    else if (/mechanic|garage|mistri|मेकेनिक|ಮೆಕ್ಯಾನಿಕ್/i.test(titleToCheck)) resolvedCat = 'MECHANIC';
    else if (/mason|brick|राजमिस्त्री|ಮೇಸ್ತ್ರಿ/i.test(titleToCheck)) resolvedCat = 'MASON';
    else if (/clean|maid|housekeep|सफाई|ಸ್ವಚ್ಛತೆ/i.test(titleToCheck)) resolvedCat = 'CLEANER';
    else if (/secur|guard|सुरक्षा|ಸೆಕ್ಯುರಿಟಿ/i.test(titleToCheck)) resolvedCat = 'SECURITY';
    else if (/deliver|courier|डिलीवरी|ಡೆಲಿವರಿ/i.test(titleToCheck)) resolvedCat = 'DELIVERY';
    else if (/garden|mali|माली|ತೋಟ/i.test(titleToCheck)) resolvedCat = 'GARDENER';
    else if (/help|hamali|labour|मजदूर|ಸಹಾಯಕ/i.test(titleToCheck)) resolvedCat = 'HELPER';
  }
  obj.category = resolvedCat || 'DRIVER';
  const realWorkerPhone = obj.applicantId?.phone || obj.applicantId?.phoneNumber;
  if (realWorkerPhone && (!obj.applicantPhone || obj.applicantPhone === '9876543210' || obj.applicantPhone === '1234567890')) {
    obj.applicantPhone = realWorkerPhone;
  }
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
