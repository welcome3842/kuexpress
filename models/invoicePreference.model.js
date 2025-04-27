module.exports = (sequelize, Sequelize) => {
  class InvoicePreference extends Sequelize.Model {}
  InvoicePreference.init(
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
      invoicePrefix: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoiceFrom: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoicePreview: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoiceCinNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoiceType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoiceHideByerContact: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoiceSignature: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'InvoicePreference', tableName: 'invoicePreferences', timestamps: true }
  );

  return InvoicePreference;
};