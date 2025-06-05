const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add isRoot flag for root users
    req.user = {
      ...user.toObject(),
      isRoot: user.role === 'root'
    };
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin' && !req.user.isRoot) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// New middleware for root-only access
const rootAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isRoot) {
        return res.status(403).json({ message: 'Root access required' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = {
  auth,
  adminAuth,
  rootAuth
}; 