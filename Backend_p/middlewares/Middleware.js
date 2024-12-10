const jwt = require('jsonwebtoken');

// Secret Key
const SECRET_KEY = 'kenilgoswami';

// Middleware to Verify JWT
exports.authenticate = (req, res, next) => {
  const token = req.cookies.token; // Get token from HttpOnly cookie
  // console.log(token)
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user data to request
    // console.log("kenil")
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token is invalid or expired' });
  }
};