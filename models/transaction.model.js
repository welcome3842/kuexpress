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
      userId: { type: Sequelize.INTEGER, allowNull: false },
      walletId: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.ENUM('credit', 'debit'), allowNull: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
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
