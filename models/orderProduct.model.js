module.exports = (sequelize, Sequelize) => {
  class OrderProduct extends Sequelize.Model {}
  OrderProduct.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unitPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue:0
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productCategory: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hsn: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      taxRate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      productDiscount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue:0
      },
    },
    { sequelize, modelName: 'OrderProduct', tableName: 'orderproducts', timestamps: true }
  );

  return OrderProduct;
};