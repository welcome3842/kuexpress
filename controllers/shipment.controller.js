const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Joi = require("joi");
const db = require("../models");
const authService = require("../services/authService");
const shipmentService = require("../services/shipmentService");
const Order = db.Order;

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
          const {
            order_type_user,
            origin,
            destination,
            weight,
            length,
            height,
            breadth,
            cod_amount,
            cod,
          } = req.body;
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
          if (priceresponse && priceresponse.message) {
            priceList = priceresponse.message;
          }
          return res.status(200).json({
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
      return res.status(500).json({ message: "Error in price list", error });
    }
  }

  static async courierList(req, res) {
    try {
      if (req.method == "POST") {
        const loginResponse = await authService.login();
        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;
          const courierresponse = await shipmentService.courierList({
            authToken,
          });
          let courierList = [];
          if (courierresponse && courierresponse.data) {
            courierList = courierresponse.data;
          }
          return res.status(200).json({
            success: true,
            couriers: courierList,
            message: "Courier list",
          });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Courier list not found" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error in courier list", error });
    }
  }

  static async createShipment(req, res) {
    try {
      if (req.method == "POST") {
        const reqData = req.body;

        const loginResponse = await authService.login();
        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;
          const shipresponse = await shipmentService.createShipment({
            reqData,
            authToken,
          });

          if (shipresponse && shipresponse.response) {
            //data updating in order table
            const order = await Order.findOne({ where: { orderNumebr: reqData.id } });
            if (order) {
              const currentDate = new Date();
              await order.update({
                status: 2,
                message: shipresponse.message,
                shipping_id: shipresponse.shipping_id,
                awb_number: shipresponse.awb_number,
                courier_id: shipresponse.courier_id,
                courier_name: shipresponse.courier_name,
                label: shipresponse.label,
                shipResponse: JSON.stringify(shipresponse),
                shipCreatedDate: currentDate,
                shipCancelDate: currentDate
              });
            }
            shipresponse.success = true;
            return res.status(200).json(shipresponse);

          } else {
            return res.status(200).json({
              success: false,
              message: shipresponse.message,
            });
          }
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Shipment creation error" });
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Error in creating shipment", error });
    }
  }


}

module.exports = ShipmentController;
