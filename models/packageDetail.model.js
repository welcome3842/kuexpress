module.exports = (sequelize, Sequelize) => {
  class PackageDetails extends Sequelize.Model { }
  PackageDetails.init(
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
      returnId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      deadWeight: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      packageDimensions: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      volumetricWeight: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      applicableWeight: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      length: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
    },
    { sequelize, modelName: 'PackageDetails', tableName: 'packagedetails', timestamps: true }
  );

  return PackageDetails;
};