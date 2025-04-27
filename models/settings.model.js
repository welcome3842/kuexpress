module.exports = (sequelize, Sequelize) => {
  class Setting extends Sequelize.Model {}
  Setting.init(
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
      twoFactorAuthentication: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Setting', tableName: 'settings', timestamps: true }
  );

  return Setting;
};