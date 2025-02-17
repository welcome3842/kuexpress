module.exports = (sequelize, Sequelize) => {
  class Order extends Sequelize.Model {
    static associate(models) {
      Order.hasMany(models.ShippingAddress, {
        foreignKey: 'orderId', as: 'buyerDetails'
      });
      Order.hasMany(models.OrderProduct, {
        foreignKey: 'orderId', as: 'productDetails'
      });
      Order.hasMany(models.PackageDetails, {
        foreignKey: 'orderId', as: 'packageDetails'
      });
      Order.hasMany(models.UserAddress, {
        foreignKey: 'orderId', as: 'pickupDetails'
      });
      Order.hasMany(models.Invoice, {
        foreignKey: 'orderId', as: 'invoice'
      });
    }
  }
  Order.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      orderNumebr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      orderChannel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentMode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shippingCharges: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      transactionFee: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      giftwrap: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      subTotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      gstAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      gstPercentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      orderDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      orderTag: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resellerName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipping_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      awb_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      courier_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      courier_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipResponse: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      shipCreatedDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      shipCancelDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Order', tableName: 'orders', timestamps: true }
  );

  return Order;
};