const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const Order = db.Order;
const ShippingAddress = db.ShippingAddress;
const BillingAddress = db.BillingAddress;
const OrderProduct = db.OrderProduct;
const PackageDetails = db.PackageDetails;
const UserAddress = db.UserAddress;
const PickupAddress = db.PickupAddress;
const Invoice = db.Invoice;
const ReturnOrder = db.ReturnOrder;
const nodemailer = require('nodemailer');
const { password } = require('../config/db.config');

class OrderController {

  static orderSchema = Joi.object({
    mobile: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    pinCode: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    buyerDetails: Joi.object().optional(),
    alternateMobile: Joi.string().allow(null, '').optional(),
    companyName: Joi.string().allow(null, '').optional(),
    gstin: Joi.string().allow(null, '').optional(),
    orderDetails: Joi.object().optional(),
    userId: Joi.number().optional(),
    landmark: Joi.string().optional(),
    isBillingAddress: Joi.boolean().optional(),
    productDetails: Joi.array().optional(),
    packageDetails: Joi.object().optional(),
    pickupDetails: Joi.object().optional(),
  });
  static async createOrder(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId = reqData.userId;

        //parameter used for the Buyer details. This data is saving into shippingaddress table
        reqData['userId'] = userId;
        reqData['name'] = reqData.buyerDetails.name;
        reqData['email'] = reqData.buyerDetails.email;
        reqData['mobile'] = reqData.buyerDetails.mobile;
        reqData['alternateMobile'] = reqData.buyerDetails.alternateMobile;
        reqData['companyName'] = reqData.buyerDetails.companyName;
        reqData['gstin'] = reqData.buyerDetails.gstin;
        reqData['address'] = reqData.buyerDetails.address;
        reqData['landmark'] = reqData.buyerDetails.landmark;
        reqData['pinCode'] = reqData.buyerDetails.pinCode;
        reqData['city'] = reqData.buyerDetails.city;
        reqData['state'] = reqData.buyerDetails.state;
        reqData['country'] = reqData.buyerDetails.country;
        reqData['isBillingAddress'] = reqData.buyerDetails.isBillingAddress;

        const { error } = OrderController.orderSchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });
        //console.log(reqData);
        //parameter used for the Order details. This data is saving into orders table
        var orderDetail = {};
        orderDetail['userId'] = userId;
        orderDetail['orderNumebr'] = reqData.orderDetails.orderNumebr;
        orderDetail['orderChannel'] = reqData.orderDetails.orderChannel;
        orderDetail['paymentMode'] = reqData.orderDetails.paymentMode;
        orderDetail['shippingCharges'] = reqData.orderDetails.shippingCharges;
        orderDetail['transactionFee'] = reqData.orderDetails.transactionFee;
        orderDetail['giftwrap'] = reqData.orderDetails.giftwrap;
        //const subTotal = reqData.orderDetails.totalAmount;
        //const gst = reqData.orderDetails.gst;
        //const gstamount = (subTotal * gst) / 100;
        //var totalPrice = parseFloat(subTotal) + parseFloat(gstamount);
        orderDetail['subTotal'] = reqData.orderDetails.subTotal;
        orderDetail['gstAmount'] = reqData.orderDetails.gstAmount;
        orderDetail['gstPercentage'] = reqData.orderDetails.gstPercentage;
        orderDetail['totalAmount'] = reqData.orderDetails.totalAmount;
        orderDetail['status'] = 1;
        orderDetail['orderDate'] = reqData.orderDetails.orderDate;
        orderDetail['orderTag'] = reqData.orderDetails.orderTag;
        orderDetail['resellerName'] = reqData.orderDetails.resellerName;
        //console.log(orderDetail);


        const order = await Order.create(orderDetail);

        const orderId = order.id;
        reqData['orderId'] = orderId;
        const shippingaddress = await ShippingAddress.create(reqData);
        if (shippingaddress) {
          await BillingAddress.create(reqData);
        }
        //pickup details
        var pickupDetail = {};
        pickupDetail['userId'] = userId;
        pickupDetail['orderId'] = orderId;
        pickupDetail['contactPerson'] = reqData.pickupDetails.contactPerson;
        pickupDetail['contactNumber'] = reqData.pickupDetails.contactNumber;
        pickupDetail['email'] = reqData.pickupDetails.email;
        pickupDetail['alternateNumber'] = reqData.pickupDetails.alternateNumber;
        pickupDetail['address'] = reqData.pickupDetails.address;
        pickupDetail['landmark'] = reqData.pickupDetails.landmark;
        pickupDetail['pinCode'] = reqData.pickupDetails.pinCode;
        pickupDetail['city'] = reqData.pickupDetails.city;
        pickupDetail['state'] = reqData.pickupDetails.state;
        pickupDetail['country'] = reqData.pickupDetails.country;
        pickupDetail['tagAddress'] = reqData.pickupDetails.tagAddress;
        pickupDetail['status'] = reqData.pickupDetails.status;
        pickupDetail['isDefaultAddress'] = reqData.pickupDetails.isDefaultAddress;

        await PickupAddress.create(pickupDetail);

        var packageDetail = {};
        packageDetail['orderId'] = orderId;
        packageDetail['deadWeight'] = reqData.packageDetails.deadWeight;
        packageDetail['packageDimensions'] = reqData.packageDetails.packageDimensions;
        packageDetail['volumetricWeight'] = reqData.packageDetails.volumetricWeight;
        packageDetail['applicableWeight'] = reqData.packageDetails.applicableWeight;
        packageDetail['length'] = reqData.packageDetails.length;
        packageDetail['width'] = reqData.packageDetails.width;
        packageDetail['height'] = reqData.packageDetails.height;
        await PackageDetails.create(packageDetail);
        //parameter used for the product details. This data is saving into shippingaddress table
        var products = reqData.productDetails;
        products.forEach(product => {
          var productDetail = {};
          productDetail['orderId'] = orderId;
          productDetail['productId'] = product.productId;
          productDetail['productName'] = product.productName;
          productDetail['unitPrice'] = product.unitPrice;
          productDetail['qty'] = product.qty;
          productDetail['productCategory'] = product.productCategory;
          productDetail['hsn'] = product.hsn;
          productDetail['sku'] = product.sku;
          productDetail['taxRate'] = product.taxRate;
          productDetail['productDiscount'] = product.productDiscount;
          OrderProduct.create(productDetail);
        });
        //const result = await OrderProduct.bulkCreate(products); // I wil do it later
        //generate invoice
        let ebill_expiry_date = new Date(orderDetail['orderDate']);
        ebill_expiry_date.setDate(ebill_expiry_date.getDate() + 15);

        var invoiceDetail = {};
        invoiceDetail['userId'] = userId;
        invoiceDetail['orderId'] = orderId;
        invoiceDetail['invoice_number'] = 'INB' + orderDetail['orderNumebr'];
        invoiceDetail['ebill_number'] = 'ENB' + orderDetail['orderNumebr'];
        invoiceDetail['invoice_date'] = orderDetail['orderDate'];
        invoiceDetail['ebill_expiry_date'] = ebill_expiry_date;
        await Invoice.create(invoiceDetail);

        return res.status(200).json({ "success": true, message: "Order created successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in order creation', error });
    }
  }
  static async getOrderList(req, res) {
    try {
      const roleId = req.user.userRole;
      const orderStatus = req.query.orderStatus ? req.query.orderStatus : '';
      if (orderStatus < 0 || orderStatus > 9) {
        return res.status(400).json({ "success": false, message: 'Order status allowed in single digit between 0-9' });
      }
      let filterData = {};
      if (orderStatus) {
        filterData.status = orderStatus;
      }
      
      if (![1, 2].includes(roleId)) {
        filterData.userId = req.user.id;
      }

      const orders = await db.Order.findAll({
        where: filterData,
        include: [
          {
            model: db.ShippingAddress,
            as: 'buyerDetails'
          },
          {
            model: db.OrderProduct,
            as: 'productDetails'
          },
          {
            model: db.PackageDetails,
            as: 'packageDetails'
          },
          {
            model: db.Invoice,
            as: 'invoice'
          },
          {
            model: db.PickupAddress,
            as: 'pickupDetails'
          }
        ],
          order: [['id', 'DESC']]
      });

      if (orders) {
        return res.status(200).json({ "success": true, "data": orders });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching orders with orders');
    }
  }
  static async getLocationBypinCode(req, res) {
    try {
      const pincode = req.params.pincode;
      const sql2 = "SELECT * FROM locations WHERE pincode = :pincode LIMIT 1";
      const result = await db.sequelize.query(sql2, {
        replacements: { pincode: pincode },
        type: db.Sequelize.QueryTypes.SELECT
      });

      if (result.length > 0) {
        return res.status(200).json({ success: true, data: result });
      } else {
        return res.status(404).json({ success: false, message: 'Pin code not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching pin code');
    }
  }
  static async getAllStates(req, res) {
    try {
      let sql2 = "SELECT * FROM states";
      const result = await db.sequelize.query(sql2);
      if (result.length > 0) {
        return res.status(200).json({ "success": true, "data": result });
      } else {
        res.status(404).send('States not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching states');
    }
  }
  static async getAllCountries(req, res) {
    try {
      let countries = "SELECT * FROM countries";
      const result = await db.sequelize.query(countries);
      if (result.length > 0) {
        return res.status(200).json({ "success": true, "data": result[0] });
      } else {
        res.status(404).send('Countries not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in fetching country');
    }
  }
  static async cancelOrder(req, res) {
    try {
      var reqData = req.body;
      const cancelOrder = await Order.findOne({ where: { orderNumebr: reqData.orderNumebr } });
      if (cancelOrder) {
        await cancelOrder.update({ status: 5 });
        return res.status(200).json({ "success": true, message: "Order canceled successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error in cancelling order');
    }
  }
  static async returnOrder(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId = reqData.userId;

        //parameter used for the Buyer details. This data is saving into shippingaddress table
        reqData['userId'] = userId;
        reqData['name'] = reqData.buyerDetails.name;
        reqData['email'] = reqData.buyerDetails.email;
        reqData['mobile'] = reqData.buyerDetails.mobile;
        reqData['alternateMobile'] = reqData.buyerDetails.alternateMobile;
        reqData['companyName'] = reqData.buyerDetails.companyName;
        reqData['gstin'] = reqData.buyerDetails.gstin;
        reqData['address'] = reqData.buyerDetails.address;
        reqData['landmark'] = reqData.buyerDetails.landmark;
        reqData['pinCode'] = reqData.buyerDetails.pinCode;
        reqData['city'] = reqData.buyerDetails.city;
        reqData['state'] = reqData.buyerDetails.state;
        reqData['country'] = reqData.buyerDetails.country;
        reqData['isBillingAddress'] = reqData.buyerDetails.isBillingAddress;

        const { error } = OrderController.orderSchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });
        //console.log(reqData);
        //parameter used for the Order details. This data is saving into orders table
        var orderDetail = {};
        orderDetail['userId'] = userId;
        orderDetail['returnNumebr'] = reqData.orderDetails.returnNumebr;
        orderDetail['orderChannel'] = reqData.orderDetails.orderChannel;
        orderDetail['paymentMode'] = reqData.orderDetails.paymentMode;
        orderDetail['shippingCharges'] = reqData.orderDetails.shippingCharges;
        orderDetail['transactionFee'] = reqData.orderDetails.transactionFee;
        orderDetail['giftwrap'] = reqData.orderDetails.giftwrap;
        orderDetail['subTotal'] = reqData.orderDetails.subTotal;
        orderDetail['gstAmount'] = reqData.orderDetails.gstAmount;
        orderDetail['gstPercentage'] = reqData.orderDetails.gstPercentage;
        orderDetail['totalAmount'] = reqData.orderDetails.totalAmount;
        orderDetail['status'] = 8;
        orderDetail['orderDate'] = reqData.orderDetails.orderDate;
        orderDetail['orderTag'] = reqData.orderDetails.orderTag;
        orderDetail['resellerName'] = reqData.orderDetails.resellerName;
        //console.log(orderDetail);


        const returnorder = await ReturnOrder.create(orderDetail);

        const returnorderId = returnorder.id;
        reqData['returnId'] = returnorderId;
        const shippingaddress = await ShippingAddress.create(reqData);
        if (shippingaddress) {
          await BillingAddress.create(reqData);
        }
        //pickup details
        var pickupDetail = {};
        pickupDetail['userId'] = userId;
        pickupDetail['returnId'] = returnorderId;
        pickupDetail['contactPerson'] = reqData.pickupDetails.contactPerson;
        pickupDetail['contactNumber'] = reqData.pickupDetails.contactNumber;
        pickupDetail['email'] = reqData.pickupDetails.email;
        pickupDetail['alternateNumber'] = reqData.pickupDetails.alternateNumber;
        pickupDetail['address'] = reqData.pickupDetails.address;
        pickupDetail['landmark'] = reqData.pickupDetails.landmark;
        pickupDetail['pinCode'] = reqData.pickupDetails.pinCode;
        pickupDetail['city'] = reqData.pickupDetails.city;
        pickupDetail['state'] = reqData.pickupDetails.state;
        pickupDetail['country'] = reqData.pickupDetails.country;
        pickupDetail['tagAddress'] = reqData.pickupDetails.tagAddress;
        pickupDetail['status'] = reqData.pickupDetails.status;
        pickupDetail['isDefaultAddress'] = reqData.pickupDetails.isDefaultAddress;

        await PickupAddress.create(pickupDetail);

        var packageDetail = {};
        packageDetail['returnId'] = returnorderId;
        packageDetail['deadWeight'] = reqData.packageDetails.deadWeight;
        packageDetail['packageDimensions'] = reqData.packageDetails.packageDimensions;
        packageDetail['volumetricWeight'] = reqData.packageDetails.volumetricWeight;
        packageDetail['applicableWeight'] = reqData.packageDetails.applicableWeight;
        packageDetail['length'] = reqData.packageDetails.length;
        packageDetail['width'] = reqData.packageDetails.width;
        packageDetail['height'] = reqData.packageDetails.height;
        await PackageDetails.create(packageDetail);
        //parameter used for the product details. This data is saving into shippingaddress table
        var products = reqData.productDetails;
        products.forEach(product => {
          var productDetail = {};
          productDetail['returnId'] = returnorderId;
          productDetail['productId'] = product.productId;
          productDetail['productName'] = product.productName;
          productDetail['unitPrice'] = product.unitPrice;
          productDetail['qty'] = product.qty;
          productDetail['productCategory'] = product.productCategory;
          productDetail['hsn'] = product.hsn;
          productDetail['sku'] = product.sku;
          productDetail['taxRate'] = product.taxRate;
          productDetail['productDiscount'] = product.productDiscount;
          OrderProduct.create(productDetail);
        });

        return res.status(200).json({ "success": true, message: "Return initiated successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in return initiate', error });
    }
  }
  static async getReturnOrderList(req, res) {
    try {
      const orderStatus = req.query.orderStatus ? req.query.orderStatus : '';
      if (orderStatus < 0 || orderStatus > 9) {
        return res.status(400).json({ "success": false, message: 'Order status allowed in single digit between 0-9' });
      }
      let filterData = {};
      if (orderStatus) {
        filterData.status = orderStatus;
      }
      const orders = await db.ReturnOrder.findAll({
        where: filterData,
        include: [
          {
            model: db.ShippingAddress,
            as: 'buyerDetails'
          },
          {
            model: db.OrderProduct,
            as: 'productDetails'
          },
          {
            model: db.PackageDetails,
            as: 'packageDetails'
          }]
      });

      if (orders) {
        return res.status(200).json({ "success": true, "data": orders });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error to fetching return orders');
    }
  }
}

module.exports = OrderController;
