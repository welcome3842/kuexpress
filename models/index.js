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
db.PackageDetails = require('./packageDetail.model')(sequelize, Sequelize);
db.UserAddress = require('./userAddress.model')(sequelize, Sequelize);

db.Wallet = require('./wallet.model')(sequelize, Sequelize);

db.Invoice = require('./invoice.model')(sequelize, Sequelize);
db.Product = require('./product.model')(sequelize, Sequelize);
db.Category = require('./category.model')(sequelize, Sequelize);
db.ReturnOrder = require('./return.order.model')(sequelize, Sequelize);
db.Task = require('./task.model')(sequelize, Sequelize);
db.UserCompanies = require('./userCompany.model')(sequelize, Sequelize);
db.UserKyc = require('./userKyc.model')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
