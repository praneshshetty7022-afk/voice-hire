import express from 'express';
import { login, register, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints (supports with and without trailing slash)
router.post(['/register', '/register/'], register);
router.post(['/login', '/login/'], login);

// Protected Profile Endpoints
router.get(['/me', '/me/'], protect, getProfile);
router.put(['/profile', '/profile/'], protect, updateProfile);

// Explicit handler if incorrect HTTP method is sent (e.g. GET instead of POST)
router.all(['/register', '/register/'], (req, res) => {
  res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed on /api/auth/register. Please use HTTP POST.`,
  });
});

router.all(['/login', '/login/'], (req, res) => {
  res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed on /api/auth/login. Please use HTTP POST.`,
  });
});

export default router;

