const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kuexpress API',
      version: '1.0.0',
      description: 'Kuexpress API',
    },
    servers: [
      {
        url: process.env.SERVER_URL ,
      },
    ],
  },
  apis: [
    path.join(__dirname, 'swaggerDocs/*.js'),
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
