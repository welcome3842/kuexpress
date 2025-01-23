const axios = require('axios');
const { apiBaseUrl, xpressbeesEmail, xpressbeesPassword } = require('../config/api.config');

exports.login = async () => {
    try {
       
        const email =  xpressbeesEmail;
        const password =  xpressbeesPassword;
        const response = await axios.post(`${apiBaseUrl}/users/franchise_login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};
