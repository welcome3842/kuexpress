require('dotenv').config();

module.exports = {
    apiBaseUrl: 'https://ship.xpressbees.com/api',    
    xpressbeesEmail: process.env.XPRESSBEES_EMAIL, 
    xpressbeesPassword: process.env.XPRESSBEES_PASSWORD, 
};
