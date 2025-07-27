require('dotenv').config();

module.exports = {
    apiBaseUrl: 'https://ship.xpressbees.com/api',
    apiDTDCBaseUrl: 'https://alphademodashboardapi.shipsy.io/api',
    DTDCAPIKEY: 'da66dccac00b76c795e827ffaafd5d',
    xpressbeesEmail: process.env.XPRESSBEES_EMAIL,
    xpressbeesPassword: process.env.XPRESSBEES_PASSWORD,
};
