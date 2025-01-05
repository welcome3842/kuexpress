module.exports = (sequelize, Sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
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
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      orderInMonth: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userRole: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue:0
      },
    },
    { sequelize, modelName: 'User', tableName: 'users', timestamps: true }
  );

  return User;
};