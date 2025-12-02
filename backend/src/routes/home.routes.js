/* 
🛣️ HOME ROUTES (Rutas) → home.routes.js
    * Define UNA sola ruta: GET /
*/

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller.js');

// http://localhost:3001/
router.get('/', homeController.getHome);

module.exports = router;