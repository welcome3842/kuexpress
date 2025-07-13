module.exports = (sequelize, Sequelize) => {
  class ServiceablePincode extends Sequelize.Model {}

  ServiceablePincode.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pincode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      codDelivery: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: true,
        defaultValue: 'N',
      },
      prepaidDelivery: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: true,
        defaultValue: 'N',
      },
      pickup: {
        type: Sequelize.ENUM('Y', 'N'),
        allowNull: true,
        defaultValue: 'N',
      },
      deliveryZone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: 'ServiceablePincode',
      tableName: 'serviceablepincodes',
      timestamps: true,
    }
  );

  return ServiceablePincode;
};
