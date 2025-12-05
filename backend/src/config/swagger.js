// backend/src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Aves - Navarrevisca & Sierra de Gredos',
    version: '1.0.0',
    description: `
      ## 📚 Documentación de la API
      
      **API RESTful para la gestión y observación de aves** 
      
      ### 🔐 Autenticación
      - Registro e inicio de sesión tradicional
      - Autenticación con Google OAuth
      - Tokens JWT para API calls
      
      ### 🦅 Funcionalidades
      - **Aves de Navarrevisca**: CRUD completo de aves
      - **Favoritos**: Usuarios pueden marcar aves favoritas
      - **Observaciones en tiempo real**: Datos de eBird para Sierra de Gredos
      - **Administración**: Panel para administradores
      
      ### 📊 Endpoints organizados por categorías:
      1. **Autenticación** - Registro, login, logout
      2. **Aves Navarrevisca** - Gestión de aves locales
      3. **Favoritos** - Gestión de aves favoritas
      4. **eBird API** - Observaciones en Sierra de Gredos
      5. **Administración** - Funciones para administradores
      
      ### 🔗 Links útiles
      - [Repositorio GitHub](https://github.com/crisglezcal/prueba-tecnica-fullstack-web-development)
      - [Frontend](http://localhost:5173)
      - [API Base URL](http://localhost:3001)
    `,
    contact: {
      name: 'API Support',
      email: 'support@avesnavarrevisca.es'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desarrollo local'
    },
    {
      url: 'https://api.avesnavarrevisca.es',
      description: 'Servidor de producción'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT en el formato: Bearer {token}'
      }
    },
    schemas: {
      Bird: {
        type: 'object',
        required: ['common_name', 'scientific_name', 'family', 'description', 'threat_level'],
        properties: {
          id_bird: {
            type: 'integer',
            description: 'ID único del ave',
            example: 1
          },
          common_name: {
            type: 'string',
            description: 'Nombre común del ave',
            example: 'Buitre leonado'
          },
          scientific_name: {
            type: string',
            description: 'Nombre científico del ave',
            example: 'Gyps fulvus'
          },
          family: {
            type: 'string',
            description: 'Familia taxonómica',
            example: 'Accipitridae'
          },
          description: {
            type: 'string',
            description: 'Descripción detallada del ave',
            example: 'Ave rapaz de gran tamaño...'
          },
          image: {
            type: 'string',
            format: 'uri',
            description: 'URL de la imagen del ave',
            example: 'https://ejemplo.com/imagen.jpg'
          },
          threat_level: {
            type: 'string',
            enum: ['LC', 'NT', 'VU', 'EN', 'CR'],
            description: 'Nivel de amenaza de conservación'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id_user: { type: 'integer', example: 1 },
          email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
          role: { type: 'string', enum: ['user', 'admin', 'client'], example: 'user' },
          name: { type: 'string', example: 'Juan' },
          surname: { type: 'string', example: 'Pérez' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Error message' },
          message: { type: 'string', example: 'Descripción detallada del error' }
        }
      }
    }
  },
  tags: [
    { name: 'Inicio', description: 'Endpoints de inicio y información general' },
    { name: 'Autenticación', description: 'Registro, login y gestión de usuarios' },
    { name: 'Autenticación - Google OAuth', description: 'Autenticación con Google' },
    { name: 'Aves - Navarrevisca', description: 'Gestión de aves de Navarrevisca' },
    { name: 'Aves - Detalle', description: 'Detalles específicos de aves' },
    { name: 'Favoritos', description: 'Gestión de aves favoritas de usuarios' },
    { name: 'eBird - Observaciones', description: 'Observaciones en tiempo real de eBird' },
    { name: 'eBird - Especies', description: 'Especies observadas en Sierra de Gredos' },
    { name: 'eBird - Búsqueda', description: 'Búsqueda de especies en eBird' },
    { name: 'eBird - Detalles', description: 'Detalles específicos de especies' },
    { name: 'eBird - Hotspots', description: 'Puntos calientes de observación' },
    { name: 'Administración - Aves', description: 'Operaciones CRUD para administradores' },
    { name: 'Administración - Autenticación', description: 'Autenticación para administradores' }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/routes/*.js',          // Todas las rutas
    './src/controllers/*.js',     // Controladores
    './src/models/*.js'          // Modelos
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;