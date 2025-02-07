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

        const payload={
          "id": "ord001",
          "unique_order_number": "yes/no",
          "payment_method": "COD",
          "consigner_name": "Rishabh201",
          "consigner_phone": "9880909090",
          "consigner_pincode": "122002",
          "consigner_city": "Gurugram",
          "consigner_state": "Haryana",
          "consigner_address": "Sikandarpur metro station",
          "consigner_gst_number": "06DSALI2367U1ZL",
          "consignee_name": "Test Consignee",
          "consignee_phone": "8989898989",
          "consignee_pincode": "110011",
          "consignee_city": "NEW DELHI",
          "consignee_state": "delhi",
          "consignee_address": "A1",
          "consignee_gst_number": "06DSALI2367U1ZE",
          "products": [
           {
            "product_name": "prod123",
            "product_qty": "1",
            "product_price": "1200",
            "product_tax_per": "",
            "product_sku": "SKU001",
            "product_hsn": "3004"
           }
          ],
          "invoice": [
           {
            "invoice_number": "INB002",
            "invoice_date": "2022-03-23",
            "ebill_number": "ENB002",
            "ebill_expiry_date": "2022-03-25"
           }
          ],
          "weight": "700",
          "breadth": "12",
          "courier_id": "01",
          "pickup_location": "franchise",
          "shipping_charges":"40",
          "cod_charges":"25",
          "discount":"20",
          "order_amount":"2500",
          "collectable_amount":"1500"
          };

        const loginResponse = await authService.login();
      
        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;
          const shipresponse = await shipmentService.createShipment({
            payload,
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
            shipresponse.success = false;
            return res.status(200).json(shipresponse);
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
