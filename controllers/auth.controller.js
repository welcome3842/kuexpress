const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const User = db.User;

class AuthController {

  static registrationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    firstName: Joi.string().required(),
    mobile: Joi.string().required(),
    email: Joi.string().email().required(),
    companyName: Joi.string().required(),
    orderInMonth: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  static async register(req, res) {
    
    const { error } = AuthController.registrationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      return res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      return res.status(500).json({ message: 'Error registering user', error });
    }
  }

  static async login(req, res) {
    const { error } = AuthController.loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging in', error });
    }
  }
}

module.exports = AuthController;
