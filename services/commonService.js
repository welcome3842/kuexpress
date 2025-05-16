const db = require('../models');
const Order = db.Order;
const ShippingAddress = db.ShippingAddress;
const OrderProduct = db.OrderProduct;
const PackageDetails = db.PackageDetails;
const UserAddress = db.UserAddress;
const Invoice = db.Invoice;

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
          model: db.PickupAddress,
          as: 'pickupDetails'
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
        }]
    });
    return orders;
  } catch (error) {
    return error;
  }
};