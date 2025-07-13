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
        if (req.method === "POST") {
          const { userId, order_type_user, origin, destination, weight, length, height, breadth, cod_amount, cod } = req.body;
          const roleId = req.user.userRole;

          // Login/authenticate once
          const loginResponse = await authService.login();
          if (!loginResponse || !loginResponse.status) {
            return res.status(200).json({ success: false, message: "Authentication failed" });
          }

          const authToken = loginResponse.data;

          // Get courier list
          const courierResponse = await shipmentService.courierList({ authToken });
          const courierList = (courierResponse && courierResponse.data) || [];

          //  Get pricing list
          const priceResponse = await shipmentService.calculatePricing({
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
          if (priceResponse && priceResponse.message) {
            const ccharge = roleId == 4 ? 1.2 : 1.1;

            priceList = priceResponse.message.map((courier) => ({
              ...courier,
              total_price: courier.total_price ? (courier.total_price * ccharge).toFixed(2) : courier.total_price,
            }));
          }

          //  Merge by courier name
          const mergedList = priceList.map((priceItem) => {
            const match = courierList.find(
              (c) => c.name.toLowerCase() === priceItem.name.toLowerCase()
            );
            return {
              ...priceItem,
              courier_id: match?.id || null,
            };
          });

          return res.status(200).json({
            success: true,
            priceList: mergedList,
            couriers: courierList,
            message: "Courier and pricing list",
          });
        }
      } catch (error) {
        console.error("Merged API error:", error);
        return res.status(500).json({ message: "Error in merged API", error });
      }

  }

  static async courierList(req, res) {
    try {
      
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
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error in courier list", error });
    }
  }

 static async dtdcPriceList(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method not allowed." });
    }

    const {
      userId,
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

    const roleId = req.user.userRole;
    const parsedWeight = parseFloat(weight);

    const [fromZoneData, toZoneData] = await Promise.all([
      db.ServiceablePincode.findOne({ where: { pincode: origin } }),
      db.ServiceablePincode.findOne({ where: { pincode: destination } }),
    ]);

    if (!fromZoneData || !toZoneData) {
      return res.status(404).json({
        success: false,
        message: "Invalid pincode(s). Delivery zone not found.",
      });
    }

    const toZone = toZoneData.deliveryZone;

    let rateList = await db.CourierRate.findAll({
      where: { deliveryZone: toZone },
      raw: true,
    });

    if (!rateList || rateList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Courier rate not found for selected zone.",
      });
    }

    const priceList = rateList.map((item) => {
      const weightB = parseFloat(item.weightB);
      const weightA = parseFloat(item.weightA);
      const weightL = parseFloat(item.weightL);

      const priceB = parseFloat(item.priceB);
      const priceA = parseFloat(item.priceA);
      const priceL = parseFloat(item.priceL);

      let finalPrice = 0;

      if (parsedWeight <= weightB) {
        finalPrice = priceB;
      } else if (parsedWeight > weightB && parsedWeight < weightL) {
        const extraWeight = parsedWeight - weightB;
        const blockCount = Math.ceil(extraWeight / weightA);
        const extraCharge = blockCount * priceA;
        finalPrice = priceB + extraCharge;
      } else {
        const roundedWeight = Math.ceil(parsedWeight);
        finalPrice = roundedWeight * priceL;
      }

      return {
        id: item.id,
        courier_id: item.id,
        courier: item.courierName,
        name: item.courierType,
        customerType: item.customerType,
        total_price: finalPrice.toFixed(2),
        expectedPickup:"",
        estimatedDelivery:""
      };
    });

    return res.status(200).json({
      success: true,
      priceList,
      message: "Courier and pricing list",
    });

  } catch (error) {
    console.error("Merged API error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in merged API",
      error: error.message,
    });
  }
}

  static async createShipment(req, res) {
    try {
      if (req.method == "POST") {
        const reqData = req.body;
        const orderNumebr = reqData.orderNumebr;

        const result = await commonService.getOrderListByOrderNumber({ orderNumebr });
       
        const addressData = result.buyerDetails;
        const pickupData = result.pickupDetails;
        const packageData = result.packageDetails;
        const invoiceData = result.invoice;

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
            response: courierresponse,
          });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Shipment not found" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error in tracking shipment", error });
    }
  }
  static async shipmentCalculator(req, res) {
    try {
      if (req.method == "POST") {
        const reqData = req.body;
        const loginResponse = await authService.login();

        if (loginResponse && loginResponse.status) {
          const authToken = loginResponse.data;
          const courierresponse = await shipmentService.calculateShipment({
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
      return res.status(500).json({ message: "Something went wrong", error });
    }
  }

}

module.exports = ShipmentController;
