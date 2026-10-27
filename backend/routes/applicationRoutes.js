import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getEmployerApplicants,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit job application (Protected or worker guest)
router.post('/', protect, applyForJob);

// Employee's own applications
router.get('/my', protect, authorize('employee'), getMyApplications);

// Employer candidate review and status management
router.get('/employer', protect, authorize('employer'), getEmployerApplicants);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

export default router;
