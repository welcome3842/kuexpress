const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

function authorize(req, res, next) {
const token = req.header('Authorization');

if (!token) return res.status(401).json({ message: 'Access denied' });
try {

 const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); 
 req.userId = decoded.id;
 next();
 } catch (error) {
 res.status(401).json({ message: 'Invalid token' });
 }
 };

module.exports = authorize;
