import express from 'express';
import { login, register, checkPhone, checkEmail, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/login', login);
router.post('/register', register);
router.post('/check-phone', checkPhone);
router.post('/check-email', checkEmail);

// Protected Profile Endpoint
router.get('/me', protect, getProfile);

export default router;
