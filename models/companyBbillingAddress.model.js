module.exports = (sequelize, Sequelize) => {
  class CompanyBillingAddress extends Sequelize.Model {}
  CompanyBillingAddress.init(
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
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      completeAaddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      addressLandmark: {
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
    },
    { sequelize, modelName: 'CompanyBillingAddress', tableName: 'companyBillingAddress', timestamps: true }
  );

  return CompanyBillingAddress;
};