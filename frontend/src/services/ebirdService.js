/* 
🔵 EBIRD API SERVICE → ebirdService.js
    * Servicio para la API EXTERNA eBird
    * SOLO LECTURA - Datos de observaciones en tiempo real
*/

import api from './api.js';

// =================================================================================================
// OBSERVACIONES DE LA SIERRA DE GREDOS (API eBird)
// =================================================================================================

/**
 * Obtener observaciones recientes de aves en la Sierra de Gredos
 * GET /api/avila/observations
 * 
 * NOTA: Este endpoint en tu backend debería consumir la API real de eBird:
 * https://api.ebird.org/v2/data/obs/ES-AN/recent
 */
export const getGredosObservations = async () => {
  try {
    const response = await api.get('/api/avila/observations');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo observaciones de Gredos:', error);
    
    // Datos de ejemplo para desarrollo si la API falla
    return getMockGredosData();
  }
};

/**
 * Obtener observaciones por especie específica
 * GET /api/avila/observations/:speciesCode
 */
export const getObservationsBySpecies = async (speciesCode) => {
  try {
    const response = await api.get(`/api/avila/observations/${speciesCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo observaciones para especie ${speciesCode}:`, error);
    throw error;
  }
};

/**
 * Obtener lista de especies observadas recientemente
 * GET /api/avila/species/recent
 */
export const getRecentSpecies = async () => {
  try {
    const response = await api.get('/api/avila/species/recent');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo especies recientes:', error);
    throw error;
  }
};

// =================================================================================================
// DATOS DE EJEMPLO PARA DESARROLLO
// =================================================================================================

/**
 * Datos mock de eBird para desarrollo
 * Esto simula lo que devolvería la API real de eBird
 */
function getMockGredosData() {
  console.log('⚠️ Usando datos de ejemplo de eBird (modo desarrollo)');
  
  return {
    success: true,
    message: 'Observaciones en Sierra de Gredos (datos de ejemplo)',
    data: [
      {
        id: 1,
        speciesCode: 'carchi1',
        commonName: 'Carbonero común',
        scientificName: 'Parus major',
        location: 'Parque Natural Sierra de Gredos',
        observationDate: '2024-01-15 08:30',
        count: 5,
        latitude: 40.2500,
        longitude: -5.2525,
        observer: 'Observador eBird'
      },
      {
        id: 2,
        speciesCode: 'eurbla1',
        commonName: 'Mirlo común',
        scientificName: 'Turdus merula',
        location: 'Laguna Grande de Gredos',
        observationDate: '2024-01-14 15:45',
        count: 3,
        latitude: 40.2550,
        longitude: -5.2450,
        observer: 'Observador eBird'
      },
      {
        id: 3,
        speciesCode: 'comrav',
        commonName: 'Cuervo grande',
        scientificName: 'Corvus corax',
        location: 'Circo de Gredos',
        observationDate: '2024-01-13 11:20',
        count: 2,
        latitude: 40.2600,
        longitude: -5.2400,
        observer: 'Observador eBird'
      },
      {
        id: 4,
        speciesCode: 'comgra',
        commonName: 'Grulla común',
        scientificName: 'Grus grus',
        location: 'Valle del Tiétar',
        observationDate: '2024-01-12 09:15',
        count: 12,
        latitude: 40.2300,
        longitude: -5.2600,
        observer: 'Observador eBird'
      },
      {
        id: 5,
        speciesCode: 'eurgol',
        commonName: 'Gorrión común',
        scientificName: 'Passer domesticus',
        location: 'Navarredonda de Gredos',
        observationDate: '2024-01-11 14:30',
        count: 8,
        latitude: 40.2400,
        longitude: -5.2500,
        observer: 'Observador eBird'
      }
    ],
    metadata: {
      source: 'eBird API (datos de ejemplo)',
      region: 'Sierra de Gredos, Ávila',
      totalObservations: 5,
      lastUpdated: new Date().toISOString(),
      note: 'Estos son datos de ejemplo. En producción se consumiría la API real de eBird.'
    }
  };
}

// =================================================================================================
// INFORMACIÓN ADICIONAL SOBRE LA API EBIRD (para referencia)
// =================================================================================================

/**
 * NOTA: La API real de eBird requiere:
 * 1. API Key: Necesitas registrarte en https://ebird.org/api/keygen
 * 2. Endpoints principales:
 *    - Observaciones recientes: https://api.ebird.org/v2/data/obs/{regionCode}/recent
 *    - Especies recientes: https://api.ebird.org/v2/data/spp/obs/{regionCode}/recent
 *    - Observaciones históricas: https://api.ebird.org/v2/data/obs/{regionCode}/recent/notable
 * 
 * 3. Para tu proyecto, deberías crear un endpoint en tu backend que:
 *    - Tenga la API key de eBird (NUNCA en el frontend)
 *    - Consuma la API de eBird
 *    - Procese y formatee los datos
 *    - Los sirva a tu frontend
 */

/**
 * Ejemplo de cómo se vería un servicio que consume eBird directamente (NO USAR EN FRONTEND):
 * 
 * const ebirdApi = axios.create({
 *   baseURL: 'https://api.ebird.org/v2',
 *   headers: {
 *     'X-eBirdApiToken': 'TU_API_KEY_AQUI' // ⚠️ NUNCA poner esto en el frontend
 *   }
 * });
 * 
 * // Esto debe hacerse en tu backend, no en el frontend
 */