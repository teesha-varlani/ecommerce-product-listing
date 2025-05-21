const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  //header data 
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // bearer token

  if (!token) return res.status(401).json({ message: 'there is no token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'token not valid' });
    req.user = user;
    next();
  });
}

module.exports = verifyToken;
