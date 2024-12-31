require('dotenv').config();

module.exports = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  dialect: process.env.DBDIALECT,
};