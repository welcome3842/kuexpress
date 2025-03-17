const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const UserCompanies = db.UserCompanies;
const { password } = require('../config/db.config');

class CompanyController {

  static companySchema = Joi.object({
    companyId: Joi.string().required(),
    companyName: Joi.string().required(),
    companyEmail: Joi.string().required(),
    userId: Joi.string().optional(),
    brandName: Joi.string().optional(),
    website: Joi.string().optional(),
    companyLogo: Joi.string().optional(),
  });
  static async createCompany(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId = reqData.userId;

        reqData['userId'] = userId;
        reqData['companyId'] = reqData.companyId;
        reqData['companyName'] = reqData.companyName;
        reqData['companyEmail'] = reqData.companyEmail;
        reqData['brandName'] = reqData.brandName;
        reqData['website'] = reqData.website;
        reqData['companyLogo'] = reqData.companyLogo;

        const { error } = CompanyController.companySchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });

        await UserCompanies.create(reqData);

        return res.status(200).json({ "success": true, message: "Company details saved successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in saving data', error });
    }
  }
  static async companyList(req, res) {
    try {
      var userId = req.query.userId;
      const userCompanies = await db.UserCompanies.findAll({
        where: {
          userId: userId
        },
        order: [['id', 'DESC']]
      });
      if (userCompanies) {
        return res.status(200).json({ "success": true, "data": userCompanies });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching company details data');
    }
  }
}

module.exports = CompanyController;
