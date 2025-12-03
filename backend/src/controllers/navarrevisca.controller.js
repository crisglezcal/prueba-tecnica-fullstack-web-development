/* 
🎮 NAVARREVISCA CONTROLLER → navarrevisca.controller.js
    * Controlador usando service y model
    * TODOS los campos ya están validados por express-validator (middleware)
*/

const navarreviscaService = require('../services/navarrevisca.service.js');
const navarreviscaModel = require('../models/navarrevisca.model.js');

// ========================================================================================================================================  
// LISTA TODAS LAS AVES (PÚBLICO)
// ========================================================================================================================================  


async function getAves(req, res) {
  try {
    console.log('Controller: GET /aves/navarrevisca');
    
    // 1. Obtener datos del service
    const aves = await navarreviscaService.getAllBirds();
    
    // 2. Formatear datos con el model
    const avesFormateadas = navarreviscaModel.formatAvesList(aves);
    
    // 3. Enviar respuesta
    res.json({
      success: true,
      message: `Lista de aves de Navarrevisca (${avesFormateadas.length})`,
      data: avesFormateadas,
      total: avesFormateadas.length,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'PostgreSQL - navarrevisca_birds'
      }
    });
    
  } catch (error) {
    console.error('Controller error en getAves:', error);
    
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}

// ========================================================================================================================================  
// CREAR NUEVA AVE (USUARIOS REGISTRADOS)
// ========================================================================================================================================  

async function createAve(req, res) {
  try {
    console.log('Controller: POST /aves/navarrevisca');
    
    // 1. Verificar autenticación (PENDIENTE)
    // const userId = req.user?.id;
    // if (!userId) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Autenticación requerida'
    //   });
    // }

    console.log('Datos validados recibidos (TODOS los campos requeridos):', {
      common_name: req.body.common_name,
      scientific_name: req.body.scientific_name,
      order: req.body.order,
      family: req.body.family,
      description: req.body.description,
      image: req.body.image,
      threat_level: req.body.threat_level
    });
    
    // 2. Formatear datos para SQL con el model
        // El model NO debe asignar valores por defecto, todos son requeridos
    const aveData = navarreviscaModel.formatAveForCreate(req.body/* , userId */);
    
    // 3. Crear en base de datos con el service
    const nuevaAve = await navarreviscaService.createBird(aveData);
    
    // 4. Formatear respuesta con el model
    const respuestaFormateada = navarreviscaModel.formatCreatedAve(nuevaAve);
    
    // 5. Enviar respuesta exitosa
    res.status(201).json({
      success: true,
      ...respuestaFormateada,
      metadata: {
        timestamp: new Date().toISOString(),
        campos_creados: 7,
        validacion: 'express-validator confirmó que todos los campos están presentes'
      }
    });
    
  } catch (error) {
    console.error('Controller error en createAve:', error);
    
    // Manejar errores específicos
    if (error.message.includes('Ya existe')) {
      return res.status(409).json({
        success: false,
        error: 'Ave duplicada',
        message: error.message,
        campo_problematico: 'scientific_name'
      });
    }
    
    if (error.message.includes('Todos los campos son requeridos') || error.code === '23502') {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'Todos los campos son requeridos. Ninguno puede estar vacío.',
        campos_requeridos: [
          'common_name',
          'scientific_name', 
          'order',
          'family',
          'description',
          'image',
          'threat_level'
        ]
      });
    }
    
    // Error genérico
    res.status(500).json({
      success: false,
      error: 'Error al crear ave',
      message: error.message,
      ayuda: 'Asegúrate de que todos los 7 campos requeridos estén presentes y sean válidos'
    });
  }
}

// Exportar funciones
module.exports = {
  getAves,
  createAve
};