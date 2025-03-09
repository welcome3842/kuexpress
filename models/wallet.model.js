module.exports = (sequelize, Sequelize) => {
  class Wallet extends Sequelize.Model {
    static associate(models) {     
      Wallet.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Wallet.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      balance: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: 'Wallet',
      tableName: 'wallets',
      timestamps: true,
    }
  );

  return Wallet;
};
