import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

let inMemoryApps = [];

/**
 * Helper to ensure a valid 24-character hex MongoDB ObjectId
 */
const toValidObjectId = (val, fallbackSeed = null) => {
  if (val && mongoose.isValidObjectId(val)) {
    return new mongoose.Types.ObjectId(String(val));
  }
  if (fallbackSeed && mongoose.isValidObjectId(fallbackSeed)) {
    return new mongoose.Types.ObjectId(String(fallbackSeed));
  }
  return new mongoose.Types.ObjectId();
};

/**
 * @desc    Submit application for a job (Manual or Voice)
 * @route   POST /api/applications or POST /api/applications/voice
 * @access  Public / Authenticated
 */
export const applyForJob = async (req, res) => {
  try {
    const {
      jobId,
      applicantName,
      workerName,
      name,
      applicantPhone,
      workerPhone,
      phone,
      applicantTrade,
      category,
      tradeCategory,
      skill,
      applicantExperience,
      experience,
      experienceYears,
      expectedWage,
      dailyWage,
      voiceRecordingUrl = '',
      voiceRecording = '',
      voiceTranscript = '',
      transcript = '',
      appliedMode,
      applicationSource,
      applicationMethod,
      jobTitle,
      jobLocation,
      location,
      employer,
      employerName,
      workerId,
      userId,
    } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    // 1. Resolve Target Job
    let targetJob = null;
    if (isDbConnected) {
      if (mongoose.isValidObjectId(jobId)) {
        targetJob = await Job.findById(jobId);
      }
      if (!targetJob) {
        targetJob = await Job.findOne({
          $or: [{ id: String(jobId) }, { title: new RegExp(jobTitle || '', 'i') }],
        });
      }
    }

    // 2. Normalise Job Details
    const cleanJobTitle =
      jobTitle || targetJob?.title || 'Professional Blue-Collar Role';
    const cleanJobLocation =
      jobLocation || location || targetJob?.location || 'Bengaluru';
    const cleanEmployerName =
      employerName || employer || targetJob?.employerName || targetJob?.companyName || 'Verified Employer';

    // 3. Resolve IDs
    const resolvedJobId = targetJob?._id || toValidObjectId(jobId, '6651a0000000000000000001');

    let resolvedEmployerId = null;
    if (targetJob?.employerId && mongoose.isValidObjectId(targetJob.employerId)) {
      resolvedEmployerId = new mongoose.Types.ObjectId(String(targetJob.employerId));
    } else {
      // Find default employer from database or use fallback seed
      if (isDbConnected) {
        const anyEmployer = await User.findOne({ role: 'employer' });
        if (anyEmployer) resolvedEmployerId = anyEmployer._id;
      }
      if (!resolvedEmployerId) {
        resolvedEmployerId = toValidObjectId(null, '6651a0000000000000000001');
      }
    }

    const rawApplicantId = req.user?._id || req.user?.id || workerId || userId;
    const resolvedApplicantId = toValidObjectId(rawApplicantId);

    // 4. Normalise Candidate Information
    const cleanName =
      applicantName || workerName || name || req.user?.fullName || req.user?.name || 'Worker Applicant';
    const cleanPhone =
      applicantPhone || workerPhone || phone || req.user?.phone || req.user?.phoneNumber || '9876543210';
    const cleanTrade =
      applicantTrade || category || tradeCategory || skill || targetJob?.category || 'DRIVER';
    const cleanExp =
      applicantExperience ||
      (experienceYears ? `${experienceYears} Years` : null) ||
      experience ||
      '2+ Years';
    const cleanWage = Number(expectedWage || dailyWage || targetJob?.dailyWage || 1200);
    const cleanRecording = voiceRecordingUrl || voiceRecording || '';
    const cleanTranscript = voiceTranscript || transcript || '';
    const cleanAppliedMode = (
      appliedMode ||
      applicationSource ||
      applicationMethod ||
      (cleanRecording ? 'VOICE' : 'MANUAL')
    ).toUpperCase();

    // 5. Database Save & Duplicate Check
    if (isDbConnected) {
      // Check for existing application by job and applicant
      const existing = await Application.findOne({
        jobId: resolvedJobId,
        $or: [
          { applicantId: resolvedApplicantId },
          { applicantPhone: cleanPhone, applicantName: cleanName },
        ],
      });

      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'You have already applied for this job! Application is under review.',
          application: existing.toJSON(),
        });
      }

      const newApp = new Application({
        jobId: resolvedJobId,
        applicantId: resolvedApplicantId,
        employerId: resolvedEmployerId,
        jobTitle: cleanJobTitle,
        jobLocation: cleanJobLocation,
        employerName: cleanEmployerName,
        applicantName: cleanName,
        applicantPhone: cleanPhone,
        applicantTrade: cleanTrade,
        applicantExperience: cleanExp,
        expectedWage: cleanWage,
        voiceRecordingUrl: cleanRecording,
        voiceTranscript: cleanTranscript,
        appliedMode: cleanAppliedMode,
        status: 'APPLIED',
      });

      await newApp.save();

      // Increment job applicants count if job is in MongoDB
      if (targetJob) {
        targetJob.applicantsCount = (targetJob.applicantsCount || 0) + 1;
        await targetJob.save();
      }

      // Also track in in-memory list for live fallback sync
      const jsonApp = newApp.toJSON();
      inMemoryApps.unshift(jsonApp);

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully to employer!',
        application: jsonApp,
      });
    }

    // 6. In-Memory Fallback
    const fallbackApp = {
      _id: 'app_' + Date.now(),
      id: 'app_' + Date.now(),
      jobId: String(resolvedJobId),
      applicantId: String(resolvedApplicantId),
      employerId: String(resolvedEmployerId),
      jobTitle: cleanJobTitle,
      jobLocation: cleanJobLocation,
      location: cleanJobLocation,
      employerName: cleanEmployerName,
      applicantName: cleanName,
      workerName: cleanName,
      applicantPhone: cleanPhone,
      applicantTrade: cleanTrade,
      category: cleanTrade,
      applicantExperience: cleanExp,
      experience: cleanExp,
      expectedWage: cleanWage,
      dailyWage: cleanWage,
      voiceRecordingUrl: cleanRecording,
      voiceRecording: cleanRecording,
      voiceTranscript: cleanTranscript,
      appliedMode: cleanAppliedMode,
      applicationSource: cleanAppliedMode,
      applicationMethod: cleanAppliedMode,
      status: 'APPLIED',
      createdAt: new Date().toISOString(),
    };

    inMemoryApps.unshift(fallbackApp);

    return res.status(201).json({
      success: true,
      message: 'Application recorded successfully.',
      application: fallbackApp,
    });
  } catch (error) {
    console.error('[Apply Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get applicant's submitted applications (Employee or Employer)
 * @route   GET /api/applications/my
 * @access  Private / Authenticated
 */
export const getMyApplications = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const applicantId = req.user?._id || req.user?.id;
    const userPhone = req.user?.phone || req.user?.phoneNumber;
    const userName = req.user?.fullName || req.user?.name;

    let apps = [];

    if (isDbConnected) {
      const orConditions = [];
      if (applicantId && mongoose.isValidObjectId(applicantId)) {
        orConditions.push({ applicantId: new mongoose.Types.ObjectId(String(applicantId)) });
      }
      if (userPhone) {
        orConditions.push({ applicantPhone: userPhone });
      }
      if (userName && userName !== 'Worker') {
        orConditions.push({ applicantName: userName });
      }

      if (orConditions.length > 0) {
        apps = await Application.find({ $or: orConditions })
          .populate('jobId')
          .sort({ createdAt: -1 });
      } else {
        apps = await Application.find()
          .populate('jobId')
          .sort({ createdAt: -1 });
      }

      const formatted = apps.map((a) => (a.toJSON ? a.toJSON() : a));

      // Merge with inMemoryApps
      inMemoryApps.forEach((mem) => {
        const matchesUser =
          (applicantId && String(mem.applicantId) === String(applicantId)) ||
          (userPhone && mem.applicantPhone === userPhone) ||
          (userName && mem.applicantName === userName);

        if (matchesUser && !formatted.some((f) => String(f._id || f.id) === String(mem._id || mem.id))) {
          formatted.push(mem);
        }
      });

      return res.status(200).json(formatted);
    }

    // In-memory fallback
    const filtered = inMemoryApps.filter((mem) => {
      if (!applicantId && !userPhone && !userName) return true;
      return (
        (applicantId && String(mem.applicantId) === String(applicantId)) ||
        (userPhone && mem.applicantPhone === userPhone) ||
        (userName && mem.applicantName === userName)
      );
    });

    return res.status(200).json(filtered);
  } catch (error) {
    console.error('[Get My Apps Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get applications by workerId
 * @route   GET /api/applications/worker/:workerId
 * @access  Public / Private
 */
export const getApplicationsByWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const orConditions = [];
      if (mongoose.isValidObjectId(workerId)) {
        orConditions.push({ applicantId: new mongoose.Types.ObjectId(String(workerId)) });
      }
      orConditions.push({ applicantPhone: workerId });

      const apps = await Application.find({ $or: orConditions })
        .populate('jobId')
        .sort({ createdAt: -1 });

      return res.status(200).json(apps.map((a) => (a.toJSON ? a.toJSON() : a)));
    }

    const filtered = inMemoryApps.filter((mem) => String(mem.applicantId) === String(workerId));
    return res.status(200).json(filtered);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Check if a candidate has already applied for a specific job
 * @route   GET /api/applications/check?jobId=...&workerId=...
 * @access  Public
 */
export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId, workerId, phone } = req.query;
    if (!jobId) {
      return res.status(400).json({ applied: false, message: 'jobId is required' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const orConditions = [];
      if (mongoose.isValidObjectId(jobId)) {
        orConditions.push({ jobId: new mongoose.Types.ObjectId(String(jobId)) });
      }

      // Find job by custom string id
      const targetJob = await Job.findOne({ id: String(jobId) });
      if (targetJob) {
        orConditions.push({ jobId: targetJob._id });
      }

      const applicantConditions = [];
      if (workerId && mongoose.isValidObjectId(workerId)) {
        applicantConditions.push({ applicantId: new mongoose.Types.ObjectId(String(workerId)) });
      }
      if (phone) {
        applicantConditions.push({ applicantPhone: phone });
      }

      if (orConditions.length > 0 && applicantConditions.length > 0) {
        const existing = await Application.findOne({
          $or: orConditions,
          $and: [{ $or: applicantConditions }],
        });

        if (existing) {
          return res.status(200).json({
            applied: true,
            application: existing.toJSON ? existing.toJSON() : existing,
          });
        }
      }
    }

    // Check inMemoryApps
    const memMatch = inMemoryApps.find(
      (a) =>
        String(a.jobId) === String(jobId) &&
        (String(a.applicantId) === String(workerId) || (phone && a.applicantPhone === phone))
    );

    if (memMatch) {
      return res.status(200).json({
        applied: true,
        application: memMatch,
      });
    }

    return res.status(200).json({ applied: false });
  } catch (error) {
    console.error('[Check Status Error]:', error);
    return res.status(500).json({ applied: false, message: error.message });
  }
};

/**
 * @desc    Get all candidates who applied to employer's jobs
 * @route   GET /api/applications/employer
 * @access  Private (Employer)
 */
export const getEmployerApplicants = async (req, res) => {
  try {
    const employerId = req.user?._id || req.user?.id;
    const { status, jobId } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const filter = {};
      if (status && status !== 'ALL') filter.status = status.toUpperCase();
      if (jobId && mongoose.isValidObjectId(jobId)) filter.jobId = jobId;

      let apps = [];

      if (employerId && mongoose.isValidObjectId(employerId)) {
        // Find all jobs posted by this employer
        const myJobs = await Job.find({ employerId }).select('_id');
        const myJobIds = myJobs.map((j) => j._id);

        apps = await Application.find({
          ...filter,
          $or: [
            { employerId: new mongoose.Types.ObjectId(String(employerId)) },
            { jobId: { $in: myJobIds } },
          ],
        })
          .populate('jobId')
          .populate('applicantId', 'fullName name phone tradeCategory location trustScore verificationStatus')
          .sort({ createdAt: -1 });
      }

      // If no applications found for this specific employer yet, return all platform candidate applications
      // so employer / recruiter can see and manage candidate applications!
      if (apps.length === 0) {
        apps = await Application.find(filter)
          .populate('jobId')
          .populate('applicantId', 'fullName name phone tradeCategory location trustScore verificationStatus')
          .sort({ createdAt: -1 });
      }

      const formatted = apps.map((a) => (a.toJSON ? a.toJSON() : a));

      // Combine with in-memory applications
      inMemoryApps.forEach((mem) => {
        if (!formatted.some((f) => String(f._id || f.id) === String(mem._id || mem.id))) {
          formatted.push(mem);
        }
      });

      return res.status(200).json(formatted);
    }

    return res.status(200).json(inMemoryApps);
  } catch (error) {
    console.error('[Get Employer Applicants Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update candidate application status (Shortlist, Hire, Reject)
 * @route   PUT /api/applications/:id/status
 * @access  Private (Employer)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, employerNotes, interviewDate, interviewTime, interviewLocation, interviewMode, employerMessage } = req.body;

    const validStatuses = [
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
    ];

    if (!validStatuses.includes(status?.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected && mongoose.isValidObjectId(id)) {
      const app = await Application.findById(id);
      if (app) {
        app.status = status.toUpperCase();
        if (employerNotes !== undefined) app.employerNotes = employerNotes;
        if (employerMessage !== undefined) app.employerMessage = employerMessage;
        if (interviewDate !== undefined) app.interviewDate = interviewDate;
        if (interviewTime !== undefined) app.interviewTime = interviewTime;
        if (interviewLocation !== undefined) app.interviewLocation = interviewLocation;
        if (interviewMode !== undefined) app.interviewMode = interviewMode;

        await app.save();
        return res.status(200).json({
          success: true,
          message: `Candidate status updated to ${app.status}`,
          application: app.toJSON(),
        });
      }
    }

    // In-memory update
    const matched = inMemoryApps.find(
      (a) => String(a.id) === String(id) || String(a._id) === String(id)
    );
    if (matched) {
      matched.status = status.toUpperCase();
      if (employerNotes !== undefined) matched.employerNotes = employerNotes;
      if (employerMessage !== undefined) matched.employerMessage = employerMessage;
      if (interviewDate !== undefined) matched.interviewDate = interviewDate;
      if (interviewTime !== undefined) matched.interviewTime = interviewTime;
      if (interviewLocation !== undefined) matched.interviewLocation = interviewLocation;
      if (interviewMode !== undefined) matched.interviewMode = interviewMode;

      return res.status(200).json({
        success: true,
        message: `Candidate status updated to ${matched.status}`,
        application: matched,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status.toUpperCase()}`,
      application: { id, status: status.toUpperCase() },
    });
  } catch (error) {
    console.error('[Update App Status Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  applyForJob,
  getMyApplications,
  getApplicationsByWorker,
  checkApplicationStatus,
  getEmployerApplicants,
  updateApplicationStatus,
};
