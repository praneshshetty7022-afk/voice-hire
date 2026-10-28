import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getEmployerApplicants,
  updateApplicationStatus,
  checkApplicationStatus,
  getApplicationsByWorker,
} from '../controllers/applicationController.js';
import { protect, optionalProtect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit job application (Manual or Voice, supporting authenticated users & guest workers)
router.post('/', optionalProtect, applyForJob);
router.post('/voice', optionalProtect, applyForJob);

// Check if user already applied
router.get('/check', checkApplicationStatus);

// Candidate / Employee's own applications list (accessible by authenticated applicants)
router.get('/my', optionalProtect, getMyApplications);

// Fallback candidate application lookup by workerId
router.get('/worker/:workerId', getApplicationsByWorker);

// Employer candidate review and status management
router.get('/employer', protect, authorize('employer', 'employee'), getEmployerApplicants);
router.put('/:id/status', protect, authorize('employer', 'employee'), updateApplicationStatus);

export default router;
