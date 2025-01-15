const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./utils/swagger');

const db = require('./models');
const api = require('./routes/api');

require('dotenv').config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());

app.use('/api', api);

// Sync database and start server
db.sequelize
  .sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch((err) => console.error('Failed to sync database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
