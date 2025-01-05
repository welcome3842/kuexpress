const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const nodemailer = require('nodemailer');
const User = db.User;
const Otp = db.Otp;
const { Op } = require('sequelize');
const { password } = require('../config/db.config');

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

  static profileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    firstName: Joi.string().required(),
    mobile: Joi.string().required(),
    companyName: Joi.string().required(),
    orderInMonth: Joi.string().required(),
    password: Joi.string(),
  });

  static async register(req, res) {

    const { error } = AuthController.registrationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      var reqData = req.body;
      reqData['password'] = await bcrypt.hash(reqData['password'], 10);
      reqData['userRole'] = 3;
      const user = await User.create(reqData);
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
      if (!user) return res.status(404).json({ "success": false, "error":'User not found!' });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ "success": false, "error":'Invalid password' });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ "success": true, token });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging in', error });
    }
  }
  static async forgotPassword(req, res) {

    // Joi validation schema for forgot password request
    const forgotPasswordSchema = Joi.object({
      email: Joi.string().required()
    });

    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Generate a random OTP
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    };

    // Set up a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sanjay.udca@gmail.com',
        pass: '12345'
      }
    });

    const { email } = req.body;

    // Check if the email exists in our users database
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { mobile: email }
        ]
      }
    });
    if (!user) return res.status(404).json({ "success": false, "error":'User not found!' });
    const userId = user.id;
    // Generate a new OTP
    const otpval = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes
    // Save OTP in memory (or database in production)
    const otpRecord = await Otp.findOne({ where: { userId } });
    if (otpRecord) {
      // Update the existing record
      var mobileVal = "";
      if(user.mobile == email) { mobileVal = user.mobile; }
      var emailVal = "";
      if(user.email == email) { emailVal = user.email; }

      await otpRecord.update({ email: emailVal, mobile: mobileVal, otp: otpval, otpExpiry: otpExpiry });
    } else {
      // Create a new record if it doesn't exist
      await Otp.create({ userId: userId, email: email, mobile: email, otp: otpval, otpExpiry: otpExpiry });
    }

    // Send OTP via email
    const mailOptions = {
      from: 'sanjay.udca@gmail.com',
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otpval}. It will expire in 10 minutes.`
    };

    try {
      //await transporter.sendMail(mailOptions); //This need to be open on live server
      res.status(200).json({ message: 'OTP '+otpval+' has been sent to your email.' });
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
  }
  static async otpVerify(req, res) {
    // Define OTP validation schema
    const otpSchema = Joi.string()
      .pattern(/^[0-9]{6}$/)  // Matches exactly 6 digits
      .required()  // Ensures the OTP is provided
      .messages({
        'string.empty': 'OTP is required',
        'string.pattern.base': 'OTP must be a 6-digit number'
      });

    // Sample OTP for validation
    var reqData = req.body;
    const otp = reqData['otp'];

    // Validate the OTP against the schema
    const { error } = otpSchema.validate(otp);
    if (error) {
      return res.status(400).json({ "success": false, message: error.details[0].message });
    }
    try {
      const otpRecord = await Otp.findOne({ where: { otp: otp } });
      if (otpRecord) {
        const currentTime = new Date().getTime();
        if (currentTime > otpRecord.otpExpiry) {
          return res.status(400).json({ success: false, message: 'OTP has expired' });
        }
        return res.status(200).json({ "success": true, message: "OTP verified successfully" });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  }
  static async passwordUpdate(req, res) {
    const reqData = req.body;
    var password = reqData['password'];
    if (password !== reqData['confirmPassword']) {
      return res.status(400).json({
          success: false,
          message: 'Password and confirm password do not match.'
      });
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long and contain at least one number.'
        });
    }
    const otpRecord = await Otp.findOne({ where: { otp: reqData['otp'] } });
    if (otpRecord) {
      const currentTime = new Date().getTime();
      if (currentTime > otpRecord.otpExpiry) {
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }
      const userId = otpRecord.userId;
      const userRecord = await User.findOne({ where: { id: userId } });
      if(userRecord) {
        const bcryptPass = await bcrypt.hash(password, 10);
        await userRecord.update({ password: bcryptPass });
        return res.status(200).json({ "success": true, message: "Password updated successfully" });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  }
  static async updateProfile(req, res) {
    try {
      var userId =  req.params.id;
      console.log(userId);
      var reqData = req.body;
      if(reqData['password']) {
        reqData['password'] = await bcrypt.hash(reqData['password'], 10);
      }
      const {
        firstName,
        lastName,
        mobile,
        companyName,
        orderInMonth,
        password,
        userRole,
      } = reqData;
      const { error } = AuthController.profileSchema.validate(reqData);
      if (error) return res.status(400).json({ message: error.details[0].message });
      const userRecord = await User.findOne({ where: { id: userId } });
      if(userRecord) {
        const user = await userRecord.update(
          {
            firstName,
            lastName,
            mobile,
            companyName,
            orderInMonth,
            password,
            userRole,
          },
          {
            where: { id: userId }, // Specify the user record to update
            returning: true, // Optional: If you need the updated record as response
          }
        );
        return res.status(200).json({ "success": true, message: "Profile updated successfully", user });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error in profile update', error });
    }
  }
}

module.exports = AuthController;
