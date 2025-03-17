module.exports = (sequelize, Sequelize) => {
  class UserCompanies extends Sequelize.Model { }
  UserCompanies.init(
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
      companyId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      brandName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      companyLogo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserCompanies',
      tableName: 'usercompanies',
      timestamps: true,
      indexes: [
        {
          fields: ['userId'], // specify the field you want to index
        },
      ],
    }
  );

  return UserCompanies;
};
