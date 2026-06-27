const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const models = require('./models');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger dokumentacija
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'EventMaster API Dokumentacija'
}));

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);

// Test ruta
app.get('/', (req, res) => {
  res.json({ message: 'EventMaster API radi!' });
});

// Pokretanje servera
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
  console.log('Baza podataka sinhronizovana');
  app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
  });
}).catch(err => {
  console.error('Greska pri konekciji sa bazom:', err);
});
