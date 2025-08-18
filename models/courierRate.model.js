module.exports = (sequelize, Sequelize) => {
  class CourierRate extends Sequelize.Model {}

  CourierRate.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      courierName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      courierType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      serviceType: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      customerType: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      weightB: {
        type: Sequelize.DECIMAL(6, 3),
        allowNull: true,
      },
      weightA: {
        type: Sequelize.DECIMAL(6, 3),
        allowNull: true,
      },
      weightL: {
        type: Sequelize.DECIMAL(6, 3),
        allowNull: true,
      },
      priceB: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      priceA: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
      },
      priceL: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
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
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      sequelize,
      modelName: 'CourierRate',
      tableName: 'courierrates',
      timestamps: true,
    }
  );

  return CourierRate;
};
