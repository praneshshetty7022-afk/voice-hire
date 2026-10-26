import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

// Employer restricted job management
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);

export default router;
