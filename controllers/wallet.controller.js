const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const Wallet = db.Wallet;
const Transaction = db.Transaction ;
const razorpay = require('../config/razorpay.config');


class WalletController {

  static WalletSchema = Joi.object({

    userId: Joi.number().required(),
   
  });

  static async createPayment(req, res) {    
    const { amount, userId } = req.body;
    try {
        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `order_rcptid_${userId}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ orderId: order.id, amount: order.amount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

  }

  static async verifyPayment(req, res) {
    const { razorpay_payment_id, userId, amount } = req.body;

    try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        if (!payment || payment.status !== "captured") {
            // return res.status(200).json({ success: false, message: "Payment verification failed" });
        }

        let wallet = await Wallet.findOne({ where: { userId } });
        if (!wallet) {
            wallet = await Wallet.create({ userId, balance: 0 });
        }

        wallet.balance += parseFloat(amount);
        await wallet.save();

        await Transaction.create({
            userId: userId,
            walletId: wallet.id,
            type: "credit",
            amount,
            balance_after:  wallet.balance,
            reason:"Wallet recharge"
        });

        res.status(200).json({ message: "Payment successful, funds added!", wallet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

  
  static async getWalletBalance(req, res) {
    const { userId } = req.params; 

    try {
        let wallet = await Wallet.findOne({ where: { userId } });

       
        if (!wallet) {
            wallet = await Wallet.create({ userId, balance: 0 });
        }

        res.status(200).json({ success: true, balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
  }

  
}

module.exports = WalletController;
