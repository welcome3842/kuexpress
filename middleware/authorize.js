const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

function authorize(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ message: 'Access denied' });
try {
 const decoded = jwt.verify(token, process.env.secret);
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ message: 'Invalid token' });
 }
 };

module.exports = authorize;
