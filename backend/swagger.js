const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventMaster API',
      version: '1.0.0',
      description: 'API dokumentacija za EventMaster aplikaciju - sistem za upravljanje dogadjajima',
      contact: {
        name: 'EventMaster Tim',
        email: 'eventmaster@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Lokalni server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token za autentifikaciju korisnika'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID korisnika' },
            name: { type: 'string', description: 'Ime korisnika' },
            email: { type: 'string', description: 'Email adresa' },
            role: { type: 'string', enum: ['guest', 'user', 'organizer'], description: 'Uloga korisnika' },
            createdAt: { type: 'string', format: 'date-time', description: 'Datum kreiranja' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID dogadjaja' },
            title: { type: 'string', description: 'Naziv dogadjaja' },
            description: { type: 'string', description: 'Opis dogadjaja' },
            date: { type: 'string', format: 'date-time', description: 'Datum odrzavanja' },
            capacity: { type: 'integer', description: 'Maksimalan broj polaznika' },
            imageUrl: { type: 'string', description: 'URL slike dogadjaja' },
            organizerId: { type: 'integer', description: 'ID organizatora' },
            categoryId: { type: 'integer', description: 'ID kategorije' },
            locationId: { type: 'integer', description: 'ID lokacije' },
            createdAt: { type: 'string', format: 'date-time', description: 'Datum kreiranja' }
          }
        },
        Registration: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID prijave' },
            userId: { type: 'integer', description: 'ID korisnika' },
            eventId: { type: 'integer', description: 'ID dogadjaja' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'], description: 'Status prijave' },
            createdAt: { type: 'string', format: 'date-time', description: 'Datum prijave' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID kategorije' },
            name: { type: 'string', description: 'Naziv kategorije' }
          }
        },
        Location: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'ID lokacije' },
            name: { type: 'string', description: 'Naziv lokacije' },
            address: { type: 'string', description: 'Adresa' },
            city: { type: 'string', description: 'Grad' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Poruka o gresci' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
