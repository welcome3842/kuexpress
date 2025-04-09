const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const UserCompany = db.UserCompany;
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
  static async createAndUpdateCompany(req, res) {
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
        let compDetails = await UserCompany.findOne({ where: { userId } });
        console.log(compDetails.userId);
        if (compDetails) {
          compDetails = await UserCompany.update(
            reqData,
            {
              where: { userId: compDetails.userId },
              returning: true
            }
          );
        }else {
          compDetails = await UserCompany.create(reqData);
        }

        return res.status(200).json({ "success": true, message: "Company details updated successfully", "data": compDetails });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in saving data', error });
    }
  }
}

module.exports = CompanyController;
