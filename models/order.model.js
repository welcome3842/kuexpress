module.exports = (sequelize, Sequelize) => {
  class Order extends Sequelize.Model {}
  Order.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INT,
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
        defaultValue:0    
      },
      transactionFee: {
        type: Sequelize.FLOAT,
        allowNull: true,    
        defaultValue:0         
      },
      giftwrap: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      subTotal: {
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
        defaultValue:0     
      },
    },
    { sequelize, modelName: 'Order', tableName: 'orders', timestamps: true }
  );

  return Order;
};