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
            console.log(courierresponse.data);
            courierList = courierresponse.data.map(courier => {
              return {
                  ...courier,
                  total_price: courier.total_price ? (courier.total_price * 1.1).toFixed(2) : courier.total_price // Increase by 10%
              };
          });
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

        const addressData = result.buyerDetails[0];
        const pickupData = result.pickupDetails[0];
        const packageData = result.packageDetails[0];
        const invoiceData = result.invoice[0];

        const invoice_date = new Date(invoiceData.invoice_date);
        const invoiceDate = invoice_date.toISOString().split('T')[0];

        const ebill_expiry_date = new Date(invoiceData.ebill_expiry_date);
        const ebillDate = ebill_expiry_date.toISOString().split('T')[0];

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
          "id": result.orderNumebr,
          "unique_order_number": "yes/no",
          "payment_method": "COD",

          "consigner_name": pickupData.contactPerson,
          "consigner_phone": pickupData.contactNumber ,
          "consigner_pincode": pickupData.pinCode,
          "consigner_city": pickupData.city,
          "consigner_state": pickupData.state,
          "consigner_address": pickupData.address,
          "consigner_gst_number": "06DSALI2367U1ZL",

          "consignee_name": addressData.name,
          "consignee_phone": addressData.mobile,
          "consignee_pincode": addressData.pinCode,
          "consignee_city": addressData.city,
          "consignee_state": addressData.state,
          "consignee_address": addressData.address,
          "consignee_gst_number": "06DSALI2367U1ZE",

          "products": productData,
          "invoice": [
            {
              "invoice_number": invoiceData.invoice_number,
              "invoice_date": invoiceDate,
              "ebill_number": invoiceData.ebill_number,
              "ebill_expiry_date": ebillDate,
            }
          ],
          "weight": packageData.deadWeight,
          "length": packageData.length,
          "breadth": packageData.width,
          "height": packageData.height,
          "courier_id": reqData.courier_id,
          "pickup_location": "franchise",
          "shipping_charges": "0",
          "cod_charges": "25",
          "discount": "0",
          "order_amount": result.totalAmount,
          "collectable_amount": result.totalAmount
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
            const order = await Order.findOne({ where: { orderNumebr: orderNumebr } });
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
      console.log(error);
      return res.status(500).json({ message: "Error in creating shipment", error });
    }
  }

  static async cancelShipment(req, res) {
    try {
      if (req.method == "POST") {
        const reqData = req.body;
        const loginResponse = await authService.login();

        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;
          const courierresponse = await shipmentService.cancelShipment({
            reqData,
            authToken,
          });
          return res.status(200).json({
            success: courierresponse.response,
            response: courierresponse.message,
          });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Shipment found" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error in cancel shipment", error });
    }
  }
  static async trackShipment(req, res) {
    try {
      if (req.method == "POST") {
        const reqData = req.body;
        const loginResponse = await authService.login();

        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;
          const courierresponse = await shipmentService.trackShipment({
            reqData,
            authToken,
          });
          return res.status(200).json({
            success: courierresponse.response,
            response: courierresponse.message,
          });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Shipment found" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error in tracking shipment", error });
    }
  }

}

module.exports = ShipmentController;
