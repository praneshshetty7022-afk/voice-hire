import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { findFallbackUserById } from '../utils/fallbackStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'voicehire_secure_jwt_secret_2026_fallback_key';
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload. Access denied.',
      });
    }

    // Load active user from database or fallback store
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id);
    } else {
      user = findFallbackUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists. Please log in again.',
      });
    }

    // Attach active user to request object
    req.user = user;
    next();
  } catch (error) {
    let msg = 'Authentication failed. Please log in again.';
    if (error.name === 'TokenExpiredError') {
      msg = 'Your session has expired. Please log in again.';
    } else if (error.name === 'JsonWebTokenError') {
      msg = 'Invalid authentication token. Access denied.';
    }
    return res.status(401).json({
      success: false,
      message: msg,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

export default { protect, authorize };
