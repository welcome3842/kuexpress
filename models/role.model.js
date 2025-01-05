module.exports = (sequelize, Sequelize) => {
  class Role extends Sequelize.Model {}
  Role.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Role', tableName: 'role', timestamps: true }
  );

  return Role;
};