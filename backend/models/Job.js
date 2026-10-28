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
  const t = String(obj.title || '').toLowerCase();
  if (!obj.category || obj.category === 'DRIVER') {
    if (/electr|wireman|बिजली|ವಿದ್ಯುತ್/i.test(t)) obj.category = 'ELECTRICIAN';
    else if (/plumb|pipe|नल|ಪ್ಲಂಬರ್/i.test(t)) obj.category = 'PLUMBER';
    else if (/carpent|wood|बढ़ई|ಬಡಗಿ/i.test(t)) obj.category = 'CARPENTER';
    else if (/cook|chef|kitchen|रसोइया|ಅಡುಗೆ/i.test(t)) obj.category = 'COOK';
    else if (/paint|पुताई|ಪೇಂಟರ್/i.test(t)) obj.category = 'PAINTER';
    else if (/welder|fabricat|वेल्डर|ವೆಲ್ಡರ್/i.test(t)) obj.category = 'WELDER';
    else if (/mechanic|garage|mistri|मेकेनिक|ಮೆಕ್ಯಾನಿಕ್/i.test(t)) obj.category = 'MECHANIC';
    else if (/mason|brick|राजमिस्त्री|ಮೇಸ್ತ್ರಿ/i.test(t)) obj.category = 'MASON';
    else if (/clean|maid|housekeep|सफाई|ಸ್ವಚ್ಛತೆ/i.test(t)) obj.category = 'CLEANER';
    else if (/secur|guard|सुरक्षा|ಸೆಕ್ಯುರಿಟಿ/i.test(t)) obj.category = 'SECURITY';
    else if (/deliver|courier|डिलीवरी|ಡೆಲಿವರಿ/i.test(t)) obj.category = 'DELIVERY';
    else if (/garden|mali|माली|ತೋಟ/i.test(t)) obj.category = 'GARDENER';
    else if (/help|hamali|labour|मजदूर|ಸಹಾಯಕ/i.test(t)) obj.category = 'HELPER';
  }
  delete obj.__v;
  return obj;
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
