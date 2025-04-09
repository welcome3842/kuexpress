module.exports = (sequelize, Sequelize) => {
  class UserBankDetail extends Sequelize.Model { }
  UserBankDetail.init(
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
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ifsc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      branch: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      passbookPhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserBankDetail',
      tableName: 'userbankdetails',
      timestamps: true,
      indexes: [
        {
          fields: ['userId'], // specify the field you want to index
        },
      ],
    }
  );

  return UserBankDetail;
};
