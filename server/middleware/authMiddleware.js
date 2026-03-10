import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token carries a tokenVersion, validate it against the DB
    if (decoded.tokenVersion !== undefined) {
      const user = await User.findById(decoded.userId).select('tokenVersion');
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        return res.status(401).json({ message: 'Session invalidated. Please sign in again.' });
      }
    }

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
