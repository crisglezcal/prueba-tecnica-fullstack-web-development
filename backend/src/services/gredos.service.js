/*
📩 GREDOS SERVICE (Servicio) → gredos.service.js
    * Mensajero externo (se comunica con APIs o bases de datos externas)
    * Hace llamadas HTTP a la API de eBird y maneja autenticación (tokens API)
    * Maneja errores de conexión externa
    * No transforma datos, solo los obtiene crudos
*/

require('dotenv').config(); // Variables de entorno
const axios = require('axios'); // Importa axios para hacer peticiones HTTP

const EBIRD_API_KEY = process.env.EBIRD_API_KEY; // Obtiene la clave API de eBird desde las variables de entorno
const BASE_URL = 'https://api.ebird.org/v2'; // URL base de la API de eBird

// 1. OBTENER OBSERVACIONES DE ÁVILA
async function getObservations(options = {}) {
  try {

    const days = options.days || 7;
    const limit = options.limit || 30;
    const hotspot = options.hotspot || false;
    const regionCode = 'ES-CL-AV'; // Código de región de Ávila

    let endpoint = `${BASE_URL}/data/obs/${regionCode}/recent`; //  Construir la url del endpoint de la API
    
    // Si el usuario quiere solo hotspots, cambiamos el endpoint
    if (hotspot) {
      endpoint = `${BASE_URL}/data/obs/${regionCode}/recent/hotspot`;
    }
    
    // Petición HTTP a eBird API
      // axios.get() envía una solicitud GET a la URL especificada
    const response = await axios.get(endpoint, {
      headers: {
        // eBird requiere este header con la clave API
        'X-eBirdApiToken': EBIRD_API_KEY
      },
      params: {
        maxResults: limit,  
        back: days          
      }
    });
    
    // response.data contiene la respuesta JSON de eBird
      // El servicio no transforma datos, solo los pasa al controller
    return response.data;
    
  } catch (error) {
    // Manejo de errores de conexión
    console.error('Error obteniendo observaciones:', error.message);
    
    // Re-lanzar el error al controller
      // throw new Error() envía el error "hacia arriba" al controller
      // El controller decidirá qué código HTTP devolver
    throw new Error(`Error al obtener observaciones: ${error.message}`);
  }
}

// 2. OBTENER LISTA DE ESPECIES DE ÁVILA
async function getSpeciesList() {
  try {
    const regionCode = 'ES-CL-AV';
    
    // Endpoint específico para lista de especies:
      // /product/spplist/ = product (producto) species list (lista de especies)
    const response = await axios.get(`${BASE_URL}/product/spplist/${regionCode}`, {
      headers: {
        'X-eBirdApiToken': EBIRD_API_KEY
      }
      // No necesita parámetros, trae todas las especies
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Error obteniendo lista de especies:', error.message);
    throw new Error(`Error al obtener lista de especies: ${error.message}`);
  }
}

// 3. BUSCAR ESPECIE
async function searchSpecies(query) {
  try {
    // Endpoint de taxonomía (clasificación de especies)
    const response = await axios.get(`${BASE_URL}/ref/taxonomy/ebird`, {
      headers: {
        'X-eBirdApiToken': EBIRD_API_KEY
      },
      params: {
        fmt: 'json',      // Formato de respuesta: JSON
        cat: 'species',   // Categoría: solo especies (no subespecies)
        locale: 'es',     // Idioma: español (para nombres comunes)
        query: query      // Término de búsqueda (ej: "águila")
      }
    });
    
    // Filtrar resultados
    const results = response.data.filter(species => 
      // Buscar en nombre común (en español por el locale: 'es')
      species.comName.toLowerCase().includes(query.toLowerCase()) ||
      // Buscar en nombre científico (en latín)
      species.sciName.toLowerCase().includes(query.toLowerCase())
    );
    
    return results;
    
  } catch (error) {
    console.error('Error buscando especie:', error.message);
    throw new Error(`Error al buscar especie: ${error.message}`);
  }
}

// 4. OBTENER DETALLES DE ESPECIE
async function getSpeciesDetail(speciesCode) {
  try {

    // Primera petición: Información taxonómica básica
      // Ejemplo: speciesCode = "butbut" (Buteo buteo - Ratonero común)
    const response = await axios.get(`${BASE_URL}/ref/taxonomy/ebird`, {
      headers: {
        'X-eBirdApiToken': EBIRD_API_KEY
      },
      params: {
        fmt: 'json',
        species: speciesCode  // Filtra por código de especie específico
      }
    });
    
    // Validar si la especie existe
      // Si la API devuelve array vacío, la especie no existe
    if (!response.data || response.data.length === 0) {
      throw new Error(`Especie con código ${speciesCode} no encontrada`);
    }
    
    // Extraer la información de la especie (primer elemento del array)
    const speciesInfo = response.data[0];
    
    // Segunda petición: Observaciones recientes en Ávila
      // Endpoint específico para observaciones de UNA especie en UNA región
    const regionCode = 'ES-CL-AV';
    const observationsResponse = await axios.get(
      `${BASE_URL}/data/obs/${regionCode}/recent/${speciesCode}`,
      {
        headers: {
          'X-eBirdApiToken': EBIRD_API_KEY
        },
        params: {
          maxResults: 10 
        }
      }
    );
    
    // Combinar ambas respuestas
      // spread operator (...) para unir los objetos
    return {
      ...speciesInfo,  // Información taxonómica
      recentObservations: observationsResponse.data || []  // Observaciones
    };
    
  } catch (error) {
    console.error('Error obteniendo detalles de especie:', error.message);
    throw new Error(`Error al obtener detalles de especie: ${error.message}`);
  }
}

// 5. OBTENER PUNTOS CALIENTES
async function getHotspots(options = {}) {
  try {
    
    // Opciones de búsqueda
    const lat = options.lat;   // Latitud (opcional)
    const lng = options.lng;   // Longitud (opcional)
    const dist = options.dist || 20;  // Distancia en km
    
    // Lógica de búsqueda
    if (lat && lng) {

      // Si el usuario proporcionó coordenadas, buscar hotspots cercanos (PENDIENTE)
      const response = await axios.get(`${BASE_URL}/ref/hotspot/geo`, {
        headers: {
          'X-eBirdApiToken': EBIRD_API_KEY
        },
        params: {
          lat: lat,    // Latitud del centro de búsqueda
          lng: lng,    // Longitud del centro de búsqueda
          dist: dist,  // Radio de búsqueda en km
          fmt: 'json'  // Formato JSON
        }
      });
      
      return response.data;
      
    } else {
      // Búsqueda por región
        // Si NO hay coordenadas, traer todos los hotspots de Ávila
      const regionCode = 'ES-CL-AV';
      const response = await axios.get(`${BASE_URL}/ref/hotspot/${regionCode}`, {
        headers: {
          'X-eBirdApiToken': EBIRD_API_KEY
        }
      });
      
      return response.data;
    }
    
  } catch (error) {
    console.error('Error obteniendo puntos calientes:', error.message);
    throw new Error(`Error al obtener puntos calientes: ${error.message}`);
  }
}

// Exportar funciones
module.exports = {
  getObservations,   
  getSpeciesList,    
  searchSpecies,     
  getSpeciesDetail,  
  getHotspots        
};