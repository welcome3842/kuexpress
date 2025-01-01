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
        type: Sequelize.INT,
        allowNull: false,       
      },
      productId: {
        type: Sequelize.INT,
        allowNull: false,       
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: true,       
      },     
      hsn: {
        type: Sequelize.STRING,
        allowNull: true,        
      }, 
      sku: {
        type: Sequelize.STRING,
        allowNull: true,        
      },     
     
      qty: {
        type: Sequelize.SMALLINT,
        allowNull: true       
      },
      productCategory: {
        type: Sequelize.INT,
        allowNull: true,
      },
      unitPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,            
      },
      taxRate: {
        type: Sequelize.INT,
        allowNull: true,
      },
      productDiscount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      
    },
    { sequelize, modelName: 'OrderProduct', tableName: 'order_products', timestamps: true }
  );

  return OrderProduct;
};