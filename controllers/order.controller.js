const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const Order = db.Order;
const ShippingAddress = db.ShippingAddress;
const BillingAddress = db.BillingAddress;
const OrderProduct = db.OrderProduct;
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
    alternateMobile: Joi.string().optional(),
    companyName: Joi.string().optional(),
    gstin: Joi.string().optional(),
    orderDetails: Joi.object().optional(),
    userId: Joi.string().optional(),
    landmark: Joi.string().optional(),
    isBillingAddress: Joi.string().optional(),
    productDetails: Joi.object().optional(),
  });
  static async createOrder(req, res) {
    try {
      if (req.method == "POST") {
        var reqData = req.body;
        var userId  = reqData.userId;
        //parameter used for the Buyer details. This data is saving into shippingaddress table
        reqData['userId']           = userId;
        reqData['name']             = reqData.buyerDetails.name;
        reqData['email']            = reqData.buyerDetails.email;
        reqData['mobile']           = reqData.buyerDetails.mobile;
        reqData['alternateMobile']  = reqData.buyerDetails.alternateMobile;
        reqData['companyName']      = reqData.buyerDetails.companyName;
        reqData['gstin']            = reqData.buyerDetails.gstin;
        reqData['address']          = reqData.buyerDetails.address;
        reqData['landmark']         = reqData.buyerDetails.landmark;
        reqData['pinCode']          = reqData.buyerDetails.pinCode;
        reqData['city']             = reqData.buyerDetails.city;
        reqData['state']            = reqData.buyerDetails.state;
        reqData['country']          = reqData.buyerDetails.country;
        reqData['isBillingAddress'] = reqData.buyerDetails.isBillingAddress;
        const shippingaddress = await ShippingAddress.create(reqData);
        if(shippingaddress) {
          await BillingAddress.create(reqData);
        }

        //console.log(reqData);
      //parameter used for the Order details. This data is saving into orders table
        var orderDetail={};
        orderDetail['userId']           =  userId;
        orderDetail['orderNumebr']      =  reqData.orderDetails.orderNumebr;
        orderDetail['orderChannel']     =  reqData.orderDetails.orderChannel;
        orderDetail['paymentMode']      =  reqData.orderDetails.paymentMode;
        orderDetail['shippingCharges']  =  reqData.orderDetails.shippingCharges;
        orderDetail['transactionFee']   =  reqData.orderDetails.transactionFee;
        orderDetail['giftwrap']         =  reqData.orderDetails.giftwrap;
        const subTotal                  =  reqData.orderDetails.totalAmount;
        const gst                       =  reqData.orderDetails.gst;
        const gstamount                 = (subTotal*gst) /100;
        var totalPrice                  = parseFloat(subTotal) + parseFloat(gstamount);
        orderDetail['subTotal']         = subTotal;
        orderDetail['gstAmount']        = gstamount;
        orderDetail['gstPercentage']    = gst;
        orderDetail['totalAmount']      = totalPrice;
        orderDetail['status']           = 1;
        orderDetail['orderDate']        =  reqData.orderDetails.orderDate;
        orderDetail['orderTag']        =  reqData.orderDetails.orderTag;
        orderDetail['resellerName']        =  reqData.orderDetails.resellerName;
        //console.log(orderDetail);

        const { error } = OrderController.orderSchema.validate(reqData);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const order = await Order.create(orderDetail);
        //parameter used for the product details. This data is saving into shippingaddress table
        var productDetail={};
        productDetail['orderId']          = order.id;
        productDetail['productId']        = reqData.productDetails.productId;
        productDetail['productName']      = reqData.productDetails.productName;
        productDetail['unitPrice']        = reqData.productDetails.unitPrice;
        productDetail['qty']              = reqData.productDetails.qty;
        productDetail['productCategory']  = reqData.productDetails.productCategory;
        productDetail['hsn']              = reqData.productDetails.hsn;
        productDetail['sku']              = reqData.productDetails.sku;
        productDetail['taxRate']          = reqData.productDetails.taxRate;
        productDetail['productDiscount']  = reqData.productDetails.productDiscount;
        await OrderProduct.create(productDetail);

        return res.status(200).json({ "success": true, message: "Order created successfully"});
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error in order creation', error });
    }
  }
}

module.exports = OrderController;
