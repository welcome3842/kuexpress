const db = require('../models');
const Order = db.Order;
const ShippingAddress = db.ShippingAddress;
const OrderProduct = db.OrderProduct;
const PackageDetails = db.PackageDetails;
const UserAddress = db.UserAddress;

exports.getOrderListByOrderNumber = async ({ orderNumebr }) => {
  try {
    const orders = await db.Order.findOne({
      where: {
        orderNumebr: orderNumebr
      },
      include: [
        {
          model: db.ShippingAddress,
          as: 'buyerDetails'
        },
        {
          model: db.UserAddress,
          as: 'pickupDetails'
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
    return orders;
  } catch (error) {
    return error;
  }
};