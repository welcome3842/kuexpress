const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Joi = require("joi");
const db = require("../models");
const authService = require("../services/authService");
const shipmentService = require("../services/shipmentService");
const commonService = require("../services/commonService");
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
        const orderNumebr = reqData.orderNumebr;

        const result = await commonService.getOrderListByOrderNumber({ orderNumebr });
        const ordData = result[0];
        const addressData = result.buyerDetails[0];
        const pickupData = result.pickupDetails[0];
        const packageData = result.packageDetails[0];
        //console.log(packageData);

        var productData = [];
        if (result.productDetails) {
          for (var i = 0; i < result.productDetails.length; i++) {
            let productObj = {
              "product_name": result.productDetails[i].productName,
              "product_qty": result.productDetails[i].qty,
              "product_price": result.productDetails[i].unitPrice,
              "product_tax_per": "",
              "product_sku": result.productDetails[i].sku,
              "product_hsn": result.productDetails[i].hsn
            }
            productData[i] = productObj;
          }
        }

        const payload = {
          "id": ordData.orderNumebr,
          "unique_order_number": "yes/no",
          "payment_method": "COD",

          "consigner_name": addressData.name,
          "consigner_phone": addressData.mobile,
          "consigner_pincode": addressData.pinCode,
          "consigner_city": addressData.city,
          "consigner_state": addressData.state,
          "consigner_address": addressData.address,
          "consigner_gst_number": "06DSALI2367U1ZL",

          "consignee_name": pickupData.contactPerson,
          "consignee_phone": pickupData.contactNumber,
          "consignee_pincode": pickupData.pinCode,
          "consignee_city": pickupData.city,
          "consignee_state": pickupData.state,
          "consignee_address": pickupData.address,
          "consignee_gst_number": "06DSALI2367U1ZE",

          "products": productData,
          "invoice": [
            {
              "invoice_number": "INB002",
              "invoice_date": "2022-03-23",
              "ebill_number": "ENB002",
              "ebill_expiry_date": "2022-03-25"
            }
          ],
          "weight": packageData.deadWeight,
          "breadth": packageData.width,
          "courier_id": reqData.courier_id,
          "pickup_location": "franchise",
          "shipping_charges": "40",
          "cod_charges": "25",
          "discount": "20",
          "order_amount": ordData.totalAmount,
          "collectable_amount": ordData.totalAmount
        };

        console.log(payload); return false;

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
