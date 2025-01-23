const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Joi = require("joi");
const db = require("../models");
const authService = require("../services/authService");
const shipmentService = require("../services/shipmentService");

class ShipmentController {
  static orderSchema = Joi.object({
    mobile: Joi.string().required(),
    email: Joi.string().required(),
  });

  static async priceList(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId = reqData.userId;

        const loginResponse = await authService.login();
        
        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;

          const { order_type_user, origin, destination, weight, length, height, breadth, cod_amount, cod  } = req.body;
          const priceresponse = await shipmentService.calculatePricing({
            order_type_user,
            origin,
            destination,
            weight,
            length,
            height,
            breadth,
            cod_amount,
            cod,
            authToken,
          });         
          let priceList = [];
          if(priceresponse && priceresponse.message)
          {
            priceList = priceresponse.message;
          }
          return res
            .status(200)
            .json({
              success: true,
              priceList: priceList,
              message: "Price list",
            });

        } else {
          return res
            .status(200)
            .json({ success: false, message: "Price list not found" });
        }
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Error in price list", error });
    }
  }
}

module.exports = ShipmentController;
