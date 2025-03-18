module.exports = (sequelize, Sequelize) => {
  class UserKyc extends Sequelize.Model { }
  UserKyc.init(
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
      kycType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Domestic'
      },
      documentType1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documentType2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documentNumber1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      documentNumber2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verifiedOn: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      kycStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currentBusinessType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verificationMethodUsed: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserKyc',
      tableName: 'userkyc',
      timestamps: true,
      indexes: [
        {
          fields: ['userId'], // specify the field you want to index
        },
      ],
    }
  );

  return UserKyc;
};
