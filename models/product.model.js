module.exports = (sequelize, Sequelize) => {
  class Product extends Sequelize.Model {
    static associate(models) {
      models.Product.belongsTo(models.Category, {
        foreignKey: 'categoryId', as: 'category'
      });
    }
  }
  Product.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Product', tableName: 'products', timestamps: true }
  );

  return Product;
};