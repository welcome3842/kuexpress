module.exports = (sequelize, Sequelize) => {
  class PickupAddress extends Sequelize.Model { }
  PickupAddress.init(
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
        allowNull: true,
      },
      returnId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      contactPerson: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contactNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      alternateNumber: {
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
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tagAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isDefaultAddress: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
    },
    {
      sequelize,
      modelName: 'PickupAddress',
      tableName: 'pickupAddress',
      timestamps: true,
      indexes: [
        {
          fields: ['userId'], // specify the field you want to index
        },
      ],
    }
  );

  return PickupAddress;
};
