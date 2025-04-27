const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const UserCompany = db.UserCompany;
const Label = db.Label;
const Setting = db.Setting;
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
  static labelsSchema = Joi.object({
    userId: Joi.optional(),
    chooseLabelFormat: Joi.optional(),
    detailsShowOnLabel: Joi.optional(),
  });
  static settingsSchema = Joi.object({
    userId: Joi.optional(),
    twoFactorAuthentication: Joi.optional(),
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
        if (compDetails) {
          UserCompany.update(
            reqData,
            {
              where: { userId: compDetails.userId },
              returning: true
            }
          );
          compDetails = await UserCompany.findOne({ where: { userId } });
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
  static async getCompanyList(req, res) {
    try {
      var userId =  req.user.id;
      const complist = await db.UserCompany.findAll({
        where: {
          userId: userId
        }
      });
      if (complist) {
        return res.status(200).json({ "success": true, "data": complist });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching company data');
    }
  }
  static async createAndUpdateLabels(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId =  req.user.id;
        console.log(userId);

        reqData['userId'] = userId;
        reqData['chooseLabelFormat'] = reqData.chooseLabelFormat;
        reqData['detailsShowOnLabel'] = JSON.stringify(reqData.detailsShowOnLabel);

        const { error } = CompanyController.labelsSchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });
        let labelsDetails = await Label.findOne({ where: { userId } });
        if (labelsDetails) {
          labelsDetails = await Label.update(
            reqData,
            {
              where: { userId: labelsDetails.userId },
              returning: true
            }
          );
          labelsDetails = await Label.findOne({ where: { userId } });
        }else {
          labelsDetails = await Label.create(reqData);
        }

        return res.status(200).json({ "success": true, message: "Labels details updated successfully", "data": labelsDetails });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in saving data', error });
    }
  }
  static async getLabelsList(req, res) {
    try {
      var userId =  req.user.id;
      const labelList = await db.Label.findAll({
        where: {
          userId: userId
        }
      });
      if (labelList) {
        return res.status(200).json({ "success": true, "data": labelList });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching label data');
    }
  }
  static async createAndUpdateSettings(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId =  req.user.id;
        console.log(userId);

        reqData['userId'] = userId;
        reqData['twoFactorAuthentication'] = reqData.twoFactorAuthentication;

        const { error } = CompanyController.settingsSchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });
        let labelsDetails = await Setting.findOne({ where: { userId } });
        if (labelsDetails) {
          labelsDetails = await Setting.update(
            reqData,
            {
              where: { userId: labelsDetails.userId },
              returning: true
            }
          );
          labelsDetails = await Setting.findOne({ where: { userId } });
        }else {
          labelsDetails = await Setting.create(reqData);
        }

        return res.status(200).json({ "success": true, message: "Settings details updated successfully", "data": labelsDetails });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in saving data', error });
    }
  }
  static async getSettingsList(req, res) {
    try {
      var userId =  req.user.id;
      const settingsListing = await db.Setting.findAll({
        where: {
          userId: userId
        }
      });
      if (settingsListing) {
        return res.status(200).json({ "success": true, "data": settingsListing });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching setting data');
    }
  }
}

module.exports = CompanyController;
