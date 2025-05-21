const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const ADMIN_CREDENTIALS = {
  //admin data
  username: 'admin',
  password: 'admin123',     
};

// login api
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
