const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Dobavljanje tokena iz headera
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Pristup odbijen. Token nije prosledjen.' });
    }

    // Verifikacija tokena
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Nevalidan token' });
  }
};

module.exports = authMiddleware;
