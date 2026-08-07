const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sanjeevani_hospital_jwt_secret_2026';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'];
  
  if (!token) {
    // Proceed with guest payload in fallback mode
    req.user = { role: 'guest' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or Expired JWT Token' });
  }
};

const verifyStaff = (req, res, next) => {
  if (req.user && req.user.role !== 'patient' && req.user.role !== 'guest') {
    next();
  } else {
    res.status(403).json({ error: 'Access Denied: Staff Permissions Required' });
  }
};

module.exports = { verifyToken, verifyStaff, JWT_SECRET };
