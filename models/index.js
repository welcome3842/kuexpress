const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
db.Otp  = require('./otp.model')(sequelize, Sequelize);
db.Role = require('./role.model')(sequelize, Sequelize);
db.Order = require('./order.model')(sequelize, Sequelize);
db.ShippingAddress = require('./shippingAddress.model')(sequelize, Sequelize);
db.BillingAddress = require('./billingAddress.model')(sequelize, Sequelize);
db.OrderProduct = require('./orderProduct.model')(sequelize, Sequelize);
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
