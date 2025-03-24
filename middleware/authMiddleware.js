const jwt = require('jsonwebtoken');

const protect = (roles = []) => {
  console.log("requesting /me")
  return (req, res, next) => {
    console.log("requesting /me/ in middleware")
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user data to the request object
      req.user = decoded;

      // If roles are passed in, check if the user's role matches
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: You do not have the right role' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = protect;
