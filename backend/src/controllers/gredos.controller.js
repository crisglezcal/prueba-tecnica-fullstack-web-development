/*
🎮 CONTROLLER (Controlador) → gredos.controller.js
    * Maneja las entradas y salidas HTTP
    * Recibe peticiones HTTP (req) del frontend
    * Llama al servicio para obtener datos
    * Llama al modelo para formatear datos
    * Devuelve respuestas HTTP (res) al frontend
    * Maneja errores HTTP (404, 500, etc.)
*/

require('dotenv').config(); // Variables de entorno
const gredosModel = require('../models/gredos.model.js'); // Importa el modelo que formatea/estructura los datos
const gredosService = require('../services/gredos.service.js'); // Importa el servicio que se comunica con APIs externas

// =============================================================================================================================
// 1. OBSERVACIONES EN ÁVILA - GET /api/avila/observations
// =============================================================================================================================
async function getObservations(req, res) {
  try {

    // req.query contiene los parámetros después del ? en la URL
      // Ej: /observations?days=3&limit=15 → req.query = {days: "3", limit: "15"}
    const days = req.query.days || 7;
    const limit = req.query.limit || 30;
    const hotspot = req.query.hotspot || false;
    const lat = req.query.lat;
    const lng = req.query.lng;
    
    // Variable para almacenar las observaciones
    let observations;
    
    // Lógica de búsqueda:
    // Si el usuario proporcionó coordenadas (lat y lng)...
    if (lat && lng) {
      // Se necesita agregar getObservationsByGeo al servicio para buscar observaciones cerca de unas coordenadas específicas (PENDIENTE)
    } else {
      // Si NO hay coordenadas, buscar observaciones generales de Ávila
      observations = await gredosService.getObservations({
        days: parseInt(days),      // Convertir a número
        limit: parseInt(limit),    // Convertir a número
        hotspot: hotspot === 'true' // Convertir string a booleano
      });
    }
    
    // Formatear los datos obtenidos
      // Llama al modelo para transformar datos crudos a formato útil
    const formattedObservations = gredosModel.formatObservations(observations);
    
    // Respuesta HTTP al frontend
      // res.json() envía una respuesta JSON al cliente
    res.json({
      success: true,           // Indicador de éxito
      region: 'Ávila',         // Región de la búsqueda
      total: formattedObservations.length,  // Cantidad total de resultados
      datos: formattedObservations,         // Los datos formateados
      metadata: {              // Metadatos adicionales
        dias: days,            // Parámetro usado en la búsqueda
        limite: limit,         // Parámetro usado en la búsqueda
        timestamp: new Date().toISOString() // Fecha/hora de la consulta
      }
    });
    
  } catch (error) {
    // Manejo de errores
      // status(500) = Error interno del servidor
    res.status(500).json({
      success: false,          // Indicador de fallo
      error: error.message     // Mensaje de error para debugging
    });
  }
}

// =============================================================================================================================
// 2. ESPECIES DE ÁVILA - GET /api/avila/species
// =============================================================================================================================
async function getSpecies(req, res) {
  try {
    // Obtener datos crudos
    const species = await gredosService.getSpeciesList();
    
    // El modelo transforma la lista de especies
    const formattedSpecies = gredosModel.formatSpecies(species);
    
    // Enviar respuesta al cliente
    res.json({
      success: true,
      region: 'Ávila',
      totalEspecies: formattedSpecies.length,  // Total de especies encontradas
      especies: formattedSpecies,              // Lista formateada
      metadata: {
        actualizado: new Date().toISOString()  // Cuándo se hizo la consulta
      }
    });
    
  } catch (error) {
    // Error interno del servidor
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// =============================================================================================================================
// 3. BUSCAR ESPECIE - GET /api/avila/species/search?q=águila
// =============================================================================================================================
async function searchSpecies(req, res) {
  try {
    // Obtener término de búsqueda
      // q = query (consulta) - lo que el usuario quiere buscar
        // Ej: /species/search?q=águila → req.query.q = "águila"
    const q = req.query.q;
    
    // Validación de entrada
    // Si no se proporcionó término de búsqueda...
    if (!q) {
      // status(400) = Bad Request (petición incorrecta)
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda (q) es requerido'
      });
    }
    
    // Buscar especie
    const results = await gredosService.searchSpecies(q);
    
    // Formatear resultados
    const formattedResults = gredosModel.formatSearchResults(results);
    
    // Respuesta
    res.json({
      success: true,
      busqueda: q,                    // Lo que buscó el usuario
      resultados: formattedResults.length, // Cuántos resultados encontró
      datos: formattedResults         // Los resultados formateados
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// =============================================================================================================================
// 4. DETALLE DE ESPECIE - GET /api/avila/species/:code
// =============================================================================================================================
async function getSpeciesDetail(req, res) {
  try {
    // Obtener código de especie
      // req.params contiene los parámetros de la ruta
        // Ej: /species/butbut → req.params.code = "butbut"
    const code = req.params.code;
    
    // Validación de entrada
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Código de especie requerido'
      });
    }
    
    // Obtener detalles
    const speciesDetail = await gredosService.getSpeciesDetail(code);
    
    // Formatear detalles
    const formattedDetail = gredosModel.formatSpeciesDetail(speciesDetail);
    
    // Respuesta al cliente
    res.json({
      success: true,
      especie: formattedDetail,  // Información básica formateada
      observacionesRecientes: {  // Observaciones adicionales
        total: speciesDetail.recentObservations?.length || 0,
        datos: speciesDetail.recentObservations?.map(obs => ({
          lugar: obs.locName,
          fecha: obs.obsDt,
          cantidad: obs.howMany
        })) || []
      },
      metadata: {
        region: 'Ávila',
        actualizado: new Date().toISOString()
      }
    });
    
  } catch (error) {
    // Errores específicos
    // Si el error indica "no encontrada"...
    if (error.message.includes('no encontrada')) {
      // status(404) = Not Found (no encontrado)
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    // Otros errores son 500
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// =============================================================================================================================
// 5. PUNTOS CALIENTES - GET /api/avila/hotspots
// =============================================================================================================================
async function getHotspots(req, res) {
  try {
    // Parámetros de búsqueda
      // Pueden venir coordenadas específicas o usar las de Ávila por defecto
    const lat = req.query.lat;   // Latitud (opcional)
    const lng = req.query.lng;   // Longitud (opcional)
    const dist = req.query.dist || 20;  // Distancia en km (por defecto 20)
    
    // Buscar puntos calientes
      // El servicio decide si buscar por coordenadas o por región
    const hotspots = await gredosService.getHotspots({
      lat: lat ? parseFloat(lat) : undefined,  // Convertir a número si existe
      lng: lng ? parseFloat(lng) : undefined,  // Convertir a número si existe
      dist: parseInt(dist)                     // Convertir a número
    });

    // Formatear resultados
    const formattedHotspots = gredosModel.formatHotspots(hotspots);

    // Respuesta
    res.json({
      success: true,
      region: 'Ávila',
      totalPuntos: formattedHotspots.length,
      puntosCalientes: formattedHotspots
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Exportar funciones
  // Esto permite que routes.js pueda importar y usar estas funciones
module.exports = {
  getObservations,   // Exporta la función 1
  getSpecies,        // Exporta la función 2  
  searchSpecies,     // Exporta la función 3
  getSpeciesDetail,  // Exporta la función 4
  getHotspots        // Exporta la función 5
};