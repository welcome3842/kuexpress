const { DataTypes } = require('sequelize');
const db = require('../config/db.config');  // Import our Database class instance

class User {
  constructor() {
    this.model = db.sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, {
      timestamps: true,  // Will automatically add createdAt and updatedAt
    });
  }

  // Create a new user
  async createUser(name, email) {
    try {
      const user = await this.model.create({ name, email });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  // Find all users
  async getAllUsers() {
    try {
      const users = await this.model.findAll();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  // Find a user by email
  async getUserByEmail(email) {
    try {
      const user = await this.model.findOne({ where: { email } });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
}

module.exports = new User();