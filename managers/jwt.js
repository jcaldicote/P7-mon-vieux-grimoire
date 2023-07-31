const jwt_ = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRE } = require("./env.js");

if (!JWT_SECRET) throw "JWT_SECRET must be set in .env ";
if (!JWT_EXPIRE) throw "JWT_EXPIRE must be set in .env ";

const sign = (payload) =>
  jwt_.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

const verify = (token) => jwt_.verify(token, JWT_SECRET);

const jwt = { sign, verify };

module.exports = jwt;
