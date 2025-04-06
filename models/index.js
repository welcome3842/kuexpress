const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const modelsDir = __dirname;
fs.readdirSync(modelsDir)
  .filter(file => file.endsWith('.model.js'))
  .forEach(file => {
    console.log(file);
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
