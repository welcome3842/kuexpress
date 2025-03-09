module.exports = (sequelize, Sequelize) => {
  class Transaction extends Sequelize.Model {
    
  }

  Transaction.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      walletId: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.ENUM('credit', 'debit'), allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true,
    }
  );

  return Transaction;
};
