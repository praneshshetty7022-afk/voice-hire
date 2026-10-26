import express from 'express';
import { login, register, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', register);
router.post('/login', login);

// Protected Profile Endpoints
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
