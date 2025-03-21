const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const Otp = db.Otp;
const { Op } = require('sequelize');
const UserAddress = db.UserAddress;
const UserKyc = db.UserKyc;

class UserController {

  static addressRegSchema = Joi.object({
    contactPerson: Joi.string().required(),
    contactNumber: Joi.string().required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    pinCode: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    userId: Joi.string().required(),
    alternateNumber: Joi.string().allow(null, '').optional(),
    address: Joi.string().allow(null, '').optional(),
    landmark: Joi.string().allow(null, '').optional(),
    tagAddress: Joi.string().allow(null, '').optional(),
    status: Joi.string().allow(null, '').optional(),
    isDefaultAddress: Joi.allow(null, '').optional(),
  });

  static userKycSchema = Joi.object({
    userId: Joi.string().required(),
    kycType: Joi.allow(null, '').optional(),
    documentType1: Joi.string().required(),
    documentType2: Joi.string().required(),
    documentNumber1: Joi.string().required(),
    documentNumber2: Joi.string().required(),
    verifiedOn: Joi.string().required(),
    kycStatus: Joi.string().required(),
    currentBusinessType: Joi.allow(null, '').optional(),
    verificationMethodUsed: Joi.allow(null, '').optional(),
  });

  static async vendorList(req, res) {

      try {           
           let filterData = { userRole: "3" };          
           const vendors = await db.User.findAll({
             where: filterData,             
               order: [['id', 'DESC']] 
           });
     
           if (vendors) {
             return res.status(200).json({ "success": true, "vendors": vendors });
           }
         } catch (error) {           
           res.status(500).send('Error fetching vendor list');
         }
    
  }

  static async userList(req, res) {

    try {           
      let filterData = { userRole: "4" };          
      const users = await db.User.findAll({
        where: filterData,             
          order: [['id', 'DESC']] 
       });

      if (users) {
        return res.status(200).json({ "success": true, "users": users });
      }
    } catch (error) {           
      res.status(500).send('Error fetching users list');
    }
  }

  static async deleteUser(req, res) {
    try {
      var userId = req.params.id;
      if (userId) {
        const user = await db.User.destroy({
          where: { id: userId },  
        });
        return res.status(200).json({ "success": true, message: "User deleted successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in deleting user');
    }
  }

  static async createAddress(req, res) {

    const { error } = UserController.addressRegSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      var reqData = req.body;
      const useraddress = await UserAddress.create(reqData);
      return res.status(201).json({ message: 'Address created successfully', useraddress });
    } catch (error) {
      return res.status(500).json({ message: 'Error in registering address', error });
    }
  }
  static async getUserAddressList(req, res) {
    try {
      const userAddress = await db.UserAddress.findAll({
        order: [['id', 'DESC']]
      });
      if (userAddress) {
        return res.status(200).json({ "success": true, "data": userAddress });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching address data');
    }
  }
  static async updateUserAddress(req, res) {
    try {
      var addressId = req.params.id;
      var reqData = req.body;
      const { error } = UserController.addressRegSchema.validate(reqData);
      if (error) return res.status(400).json({ message: error.details[0].message });
      const userAddress = await UserAddress.findOne({ where: { id: addressId } });
      if (userAddress) {
        const useraddress = await userAddress.update(
          reqData,
          {
            where: { id: addressId }, // Specify the useraddress record to update
            returning: true, // Optional: If you need the updated record as response
          }
        );
        return res.status(200).json({ "success": true, message: "Address details updated successfully", "data": userAddress });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in address update', error });
    }
  }
  static async delUserAddress(req, res) {
    try {
      var addressId = req.params.id;
      if (addressId) {
        const userAddress = await db.UserAddress.destroy({
          where: { id: addressId },  // Empty object to delete all records
        });
        return res.status(200).json({ "success": true, message: "Address deleted successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in deleting address data');
    }
  }
  static async generateAddressOtp(req, res) {

    // Joi validation schema for forgot password request
    const otpSchema = Joi.object({
      contactNumber: Joi.string().required(),
      type: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const { error } = otpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Generate a random OTP
    const generateOTP = () => {
      return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    };

    //const { contactNumber } = req.body;
    var reqData = req.body;
    // Generate a new OTP
    const otpval = generateOTP();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes
    // Save OTP in memory (or database in production)
    const otpRecord = await Otp.findOne({
      where: {
        mobile: reqData.contactNumber,
        type: reqData.type,
        userId: reqData.userId
      }
    })
    if (otpRecord) {
      await otpRecord.update({ otp: otpval, otpExpiry: otpExpiry });
    } else {
      // Create a new record if it doesn't exist
      await Otp.create({ userId: reqData.userId, mobile: reqData.contactNumber, otp: otpval, otpExpiry: otpExpiry, type: reqData.type });
    }

    try {
      res.status(200).json({ message: 'OTP ' + otpval + ' has been sent to your mobile.' });
    } catch (err) {
      console.error('Error sending otp:', err);
      res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
  }

  static async verifyAddress(req, res) {
    // Define OTP validation schema
    const verifiedotpSchema = Joi.object({
      otp: Joi.string().required(),
      type: Joi.string().required(),
      addressId: Joi.string().required(),
    });

    // Sample OTP for validation
    var reqData = req.body;

    // Validate the OTP against the schema
    const { error } = verifiedotpSchema.validate(reqData);
    if (error) {
      return res.status(400).json({ "success": false, message: error.details[0].message });
    }
    try {
      const otpRecord = await Otp.findOne({
        where: {
          otp: reqData.otp,
          type: reqData.type
        }
      })
      if (otpRecord) {
        const currentTime = new Date().getTime();
        if (currentTime > otpRecord.otpExpiry) {
          return res.status(400).json({ success: false, message: 'OTP has expired' });
        }
        const userAddress = await UserAddress.findOne({ where: { id: reqData.addressId } });
        if (userAddress) {
          await userAddress.update({ status: 'Verified' });
          return res.status(200).json({ "success": true, message: "Address verified successfully" });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error });
    }
  }

  static async createKyc(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId = reqData.userId;

        reqData['userId']                 = userId;
        reqData['kycType']                = reqData.kycType;
        reqData['documentType1']          = reqData.documentType1;
        reqData['documentType2']          = reqData.documentType2;
        reqData['documentNumber1']        = reqData.documentNumber1;
        reqData['documentNumber2']        = reqData.documentNumber2;
        reqData['verifiedOn']             = reqData.verifiedOn;
        reqData['kycStatus']              = reqData.kycStatus;
        reqData['currentBusinessType']    = reqData.currentBusinessType;
        reqData['verificationMethodUsed'] = reqData.verificationMethodUsed;

        const { error } = UserController.userKycSchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });

        await UserKyc.create(reqData);

        return res.status(200).json({ "success": true, message: "User KYC details saved successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in saving data', error });
    }
  }
  static async getUserKycList(req, res) {
    try {
      const userkyc = await db.UserKyc.findAll({
        order: [['id', 'DESC']]
      });
      if (userkyc) {
        return res.status(200).json({ "success": true, "data": userkyc });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching kyc data');
    }
  }
}

module.exports = UserController;
