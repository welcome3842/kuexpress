module.exports = (sequelize, Sequelize) => {
  class Otp extends Sequelize.Model {}
  Otp.init(
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
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otpExpiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Otp', tableName: 'otps', timestamps: true }
  );

  return Otp;
};