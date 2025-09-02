const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Joi = require('joi');
const db = require('../models');
const Otp = db.Otp;
const { Op } = require('sequelize');


class DashboardController {

  static async index(req, res) {
  try {
    const loggedInUser = req.user;
    const role = loggedInUser.userRole;

    const countOrders = async (role, status = null, userId = null) => {
      let where = {};
      if (status) where.status = status;
      if (userId) where.userId = userId; 

      return db.Order.count({
        include: [
          {
            model: db.User,
            as: "userDetails",
            where: userId ? { id: userId } : { userRole: role }
          }
        ],
        where
      });
    };

    let responseData = {};

    if (role === 1 || role === 2) {
     
      const totalVendors = await db.User.count({ where: { userRole: "3" } }); // B2B
      const totalUsers   = await db.User.count({ where: { userRole: "4" } }); // B2C
      const totalOrders  = await db.Order.count();

      // B2B counts
      const totalB2BOrders   = await countOrders("3");
      const newB2BOrders     = await countOrders("3", "1");
      const readyToShipB2B   = await countOrders("3", "2");
      const pickupB2B        = await countOrders("3", "3");
      const inTransitB2B     = await countOrders("3", "4");
      const deliveredB2B     = await countOrders("3", "5");
      const rtoB2B           = await countOrders("3", "6");

      // B2C counts
      const totalB2COrders   = await countOrders("4");
      const newB2COrders     = await countOrders("4", "1");
      const readyToShipB2C   = await countOrders("4", "2");
      const pickupB2C        = await countOrders("4", "3");
      const inTransitB2C     = await countOrders("4", "4");
      const deliveredB2C     = await countOrders("4", "5");
      const rtoB2C           = await countOrders("4", "6");

      responseData = {
        users: { totalVendors, totalUsers },
        orders: {
          totalOrders,
          b2b: {
            totalUser: totalVendors,
            total: totalB2BOrders,
            new: newB2BOrders,
            readyToShip: readyToShipB2B,
            pickup: pickupB2B,
            inTransit: inTransitB2B,
            delivered: deliveredB2B,
            rto: rtoB2B
          },
          b2c: {
            totalUser: totalUsers,
            total: totalB2COrders,
            new: newB2COrders,
            readyToShip: readyToShipB2C,
            pickup: pickupB2C,
            inTransit: inTransitB2C,
            delivered: deliveredB2C,
            rto: rtoB2C
          }
        }
      };
    } else if (role === 3 || role === 4) {
     
      const userId = loggedInUser.id;

      const totalOrders = await db.Order.count({ where: { userId } });

      const newOrders       = await db.Order.count({ where: { userId, status: "1" } });
      const readyToShip     = await db.Order.count({ where: { userId, status: "2" } });
      const pickup          = await db.Order.count({ where: { userId, status: "3" } });
      const inTransit       = await db.Order.count({ where: { userId, status: "4" } });
      const delivered       = await db.Order.count({ where: { userId, status: "5" } });
      const rto             = await db.Order.count({ where: { userId, status: "6" } });

      responseData = {
        userId,
        role,
        orders: {
          total: totalOrders,
          new: newOrders,
          readyToShip,
          pickup,
          inTransit,
          delivered,
          rto
        }
      };
    }

    return res.status(200).json({ success: true, data: responseData });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching dashboard data');
  }
}



}

module.exports = DashboardController;
