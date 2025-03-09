module.exports = (sequelize, Sequelize) => {
  class Invoice extends Sequelize.Model {}
  Invoice.init(
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
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ebill_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoice_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ebill_expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Invoice', tableName: 'Invoices', timestamps: true }
  );

  return Invoice;
};