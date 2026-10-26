import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 'UNAUTHORIZED',
      message: 'Access denied. Corporate token missing.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'veriproof_gold_standard_corporate_jwt_secret_key_2026';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: 'Session expired or invalid token. Please authenticate again.',
    });
  }
};
