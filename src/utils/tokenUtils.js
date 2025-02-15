const jwt = require('jsonwebtoken');

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h', // or any desired expiration
  });
}

module.exports = {
  generateToken,
};
