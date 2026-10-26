import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'voicehire_secure_corporate_platform_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    let user = null;
    try {
      user = await User.findById(decoded.id);
    } catch (dbErr) {
      // In-memory or offline fallback
    }

    if (!user) {
      // Fallback user object from decoded token payload
      user = {
        _id: decoded.id,
        id: decoded.id,
        phone: decoded.phone || decoded.phoneNumber || '9876543210',
        fullName: decoded.fullName || (decoded.role === 'employer' ? 'Lead Employer' : 'Verified Worker'),
        role: decoded.role || 'employee',
        preferredLanguage: 'en',
        location: 'Bengaluru',
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or token expired. Please log in again.',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this route. Required: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};

export default { protect, authorize };
