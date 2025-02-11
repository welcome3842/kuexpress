const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const Product = db.Product;
const Category = db.Category;

class ProductController {

  static async getProductList(req, res) {
    try {
      const products = await db.Product.findAll({
        include: [
          {
            model: db.Category,
            as: 'category'
          }]
      });
      if (products) {
        return res.status(200).json({ "success": true, "data": products });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching in products');
    }
  }
}

module.exports = ProductController;
