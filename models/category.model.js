module.exports = (sequelize, Sequelize) => {
  class Category extends Sequelize.Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'id', as: 'products'
      });
    }
  }
  Category.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'Category', tableName: 'categories', timestamps: true }
  );

  return Category;
};