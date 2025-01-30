module.exports = (sequelize, Sequelize) => {
  class ShippingAddress extends Sequelize.Model {}
  ShippingAddress.init(
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
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      landmark: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pinCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isBillingAddress: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
    },
    { sequelize, modelName: 'ShippingAddress', tableName: 'shippingaddress', timestamps: true }
  );

  return ShippingAddress;
};