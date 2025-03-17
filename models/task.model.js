
module.exports = (sequelize , Sequelize) => {
  class Task extends Sequelize.Model {}

  Task.init(
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      project: {
        type: Sequelize.STRING(255),
      },
      start_date: {
        type: Sequelize.DATEONLY, 
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      estimated_hour: {
        type: Sequelize.TIME, // Stores time (HH:MM:SS)
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(50),
      },
      priority: {
        type: Sequelize.STRING(50),
      },
      category: {
        type: Sequelize.STRING(50),
      },
      permission: {
        type: Sequelize.STRING(50),
      },
      deadline_add: {
        type: Sequelize.DATEONLY,
      },
      assigned_to: {
        type: Sequelize.STRING(255),
      },
      responsible_person: {
        type: Sequelize.STRING(255),
      },
      description: {
        type: Sequelize.TEXT,
      },
      summary: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
      timestamps: true     
    }
  );

  return Task;
};
