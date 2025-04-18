module.exports = (sequelize, Sequelize) => {
  class ReturnOrder extends Sequelize.Model {
    static associate(models) {
      ReturnOrder.hasMany(models.ShippingAddress, {
        foreignKey: 'returnId', as: 'buyerDetails'
      });
      ReturnOrder.hasMany(models.OrderProduct, {
        foreignKey: 'returnId', as: 'productDetails'
      });
      ReturnOrder.hasMany(models.PackageDetails, {
        foreignKey: 'returnId', as: 'packageDetails'
      });
      ReturnOrder.hasMany(models.UserAddress, {
        foreignKey: 'returnId', as: 'pickupDetails'
      });
    }
  }
  ReturnOrder.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      returnNumebr: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      orderChannel: {
        type: Sequelize.STRING,
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
      returnDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      returnReason: {
        type: Sequelize.STRING,
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
    },
    { sequelize, modelName: 'ReturnOrder', tableName: 'returnorders', timestamps: true }
  );

  return ReturnOrder;
};