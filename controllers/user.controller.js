const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const UserAddress = db.UserAddress;

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
}

module.exports = UserController;
