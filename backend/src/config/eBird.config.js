/* 
🐦 eBird.config.js - Configuración de la API eBird 2.0
    * Usa la API pública de eBird para obtener datos de aves
    * Configura la clave API y parámetros por defecto
    * Exporta la configuración para usar en otros módulos
*/

const ebirdConfig = {
  API_KEY: process.env.EBIRD_API_KEY,
  BASE_URL: 'https://api.ebird.org/v2',
  REGION_CODE: 'ES-CL-AV', // Ávila
  DEFAULT_DAYS: 7,
  DEFAULT_LIMIT: 50,
  
  headers: {
    'X-eBirdApiToken': process.env.EBIRD_API_KEY,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export default ebirdConfig;