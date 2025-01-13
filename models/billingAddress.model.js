module.exports = (sequelize, Sequelize) => {
  class BillingAddress extends Sequelize.Model {}
  BillingAddress.init(
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
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
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
    },
    { sequelize, modelName: 'BillingAddress', tableName: 'billingaddress', timestamps: true }
  );

  return BillingAddress;
};