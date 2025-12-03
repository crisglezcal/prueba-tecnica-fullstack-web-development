/* 
📩 EBIRD SERVICE → eBird.service.js
    * Servicio para interactuar con la API de eBird
    * Utiliza un cliente HTTP configurado con axios
    * Maneja errores de conexión y respuestas de la API
*/

// Importa axios para hacer peticiones HTTP
const axios = require('axios');
require('dotenv').config();

// Configuración de la API eBird
const EBIRD_API_KEY = process.env.EBIRD_API_KEY;
const EBIRD_BASE_URL = 'https://api.ebird.org/v2';

// Cliente HTTP configurado
const ebirdClient = axios.create({
  baseURL: EBIRD_BASE_URL,
  headers: {
    'X-eBirdApiToken': EBIRD_API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

const ebirdService = {
  
  // 1. OBSERVACIONES EN ÁVILA
  getObservations: async function(options = {}) {
    try {
      const days = options.days || 7;
      const limit = options.limit || 50;
      const hotspot = options.hotspot || false;
      const region = options.region || 'ES-CL-AV';
      
      let endpoint = `/data/obs/${region}/recent`;
      if (hotspot) {
        endpoint = `/data/obs/${region}/recent/hotspots`;
      }
      
      const response = await ebirdClient.get(endpoint, {
        params: {
          back: days,
          maxResults: limit,
          detail: 'full'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en getObservations:', error.response?.data || error.message);
      throw new Error('Error al obtener observaciones: ' + error.message);
    }
  },
  
  // 2. ESPECIES DE ÁVILA
  getSpeciesList: async function(region = 'ES-CL-AV') {
    try {
      const response = await ebirdClient.get(`/product/spp/${region}`, {
        params: {
          fmt: 'json',
          cat: 'species'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en getSpeciesList:', error.response?.data || error.message);
      throw new Error('Error al obtener lista de especies: ' + error.message);
    }
  },
  
  // 3. BUSCAR ESPECIE
  searchSpecies: async function(query, locale = 'es') {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('La búsqueda debe tener al menos 2 caracteres');
      }
      
      const response = await ebirdClient.get('/ref/taxonomy/ebird', {
        params: {
          fmt: 'json',
          species: query,
          locale: locale
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en searchSpecies:', error.response?.data || error.message);
      throw new Error('Error al buscar especies: ' + error.message);
    }
  },
  
  // 4. INFORMACIÓN DETALLADA
  getSpeciesDetail: async function(speciesCode) {
    try {
      // Obtener información taxonómica
      const taxonomyResponse = await ebirdClient.get('/ref/taxonomy/ebird', {
        params: {
          fmt: 'json',
          species: speciesCode,
          locale: 'es'
        }
      });
      
      const speciesInfo = taxonomyResponse.data[0];
      if (!speciesInfo) {
        throw new Error('Especie no encontrada');
      }
      
      // Obtener observaciones recientes en Ávila
      let recentObservations = [];
      try {
        const observationsResponse = await ebirdClient.get(`/data/obs/ES-CL-AV/recent/${speciesCode}`, {
          params: { back: 30 }
        });
        recentObservations = observationsResponse.data;
      } catch (obsError) {
        console.warn('No se pudieron obtener observaciones recientes:', obsError.message);
      }
      
      return {
        ...speciesInfo,
        recentObservations: recentObservations.slice(0, 10)
      };
    } catch (error) {
      console.error('Error en getSpeciesDetail:', error.response?.data || error.message);
      throw new Error('Error al obtener detalles de la especie: ' + error.message);
    }
  },
  
  // 5. PUNTOS CALIENTES
  getHotspots: async function(options = {}) {
    try {
      const lat = options.lat;
      const lng = options.lng;
      const dist = options.dist || 20;
      const region = options.region || 'ES-CL-AV';
      
      let hotspots;
      if (lat && lng) {
        // Hotspots por geolocalización
        const response = await ebirdClient.get('/ref/hotspot/geo', {
          params: {
            lat: lat,
            lng: lng,
            dist: dist,
            fmt: 'json'
          }
        });
        hotspots = response.data;
      } else {
        // Todos los hotspots de Ávila
        const response = await ebirdClient.get(`/ref/hotspot/${region}`);
        hotspots = response.data;
      }
      
      return hotspots;
    } catch (error) {
      console.error('Error en getHotspots:', error.response?.data || error.message);
      throw new Error('Error al obtener puntos calientes: ' + error.message);
    }
  }
};

module.exports = ebirdService; 