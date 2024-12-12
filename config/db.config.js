const { Sequelize } = require('sequelize');
require('dotenv').config();

class Database {
  constructor() {
    // Use environment variables for credentials, or hardcode values as a fallback
    this.dbName = process.env.DBNAME || 'kuexpress_db';
    this.dbUser = process.env.DATABASEUSER || 'root';
    this.dbPassword = process.env.DBPASSWORD || 'Sanjay@123';
    this.dbHost = process.env.DBHOST || 'localhost';
    this.dbDialect = process.env.DBDIALECT || 'mysql';  // For PostgreSQL
    this.sequelize = null;
  }

  // Initialize Sequelize connection
  init() {
    this.sequelize = new Sequelize(this.dbName, this.dbUser, this.dbPassword, {
      host: this.dbHost,
      dialect: this.dbDialect,
      logging: false,  // Disable query logging for a cleaner console output
    });
  }

  // Close the connection
  close() {
    if (this.sequelize) {
      this.sequelize.close();
    }
  }
}

module.exports = new Database();

