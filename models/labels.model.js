module.exports = (sequelize, Sequelize) => {
  class Label extends Sequelize.Model {}
  Label.init(
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
      chooseLabelFormat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      detailsShowOnLabel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'Label', tableName: 'labels', timestamps: true }
  );

  return Label;
};