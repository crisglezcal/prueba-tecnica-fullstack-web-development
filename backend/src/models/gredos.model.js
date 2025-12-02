/* 
📑 MODEL (Modelo) → gredos.model.js
    * Es el cerebro de los datos, se preocupa por la estructura y transformación de los datos
    * Define cómo se deben estructurar los datos (modelado de datos)
    * Transforma/formatea datos crudos de la API en datos útiles para la app ("traductor de datos")
*/

// =============================================================================================================================
// 1. FORMATEAR OBSERVACIONES
// =============================================================================================================================
function formatObservations(observations) {
  
    // Transforma un array de observaciones crudas a formato útil
        // observations.map() recorre cada observación y la transforma
  return observations.map(obs => ({

    // De inglés/API a español/frontend
    especie: obs.comName,           // comName → common name (nombre común)
    nombreCientifico: obs.sciName,  // sciName → scientific name (nombre científico)
    lugar: obs.locName,             // locName → location name (nombre del lugar)
    fecha: obs.obsDt,               // obsDt → observation date (fecha observación)
    
    // Valores por defecto
    // Si howMany no existe, asumimos 1 individuo observado
    cantidad: obs.howMany || 1,
    
    // Coordenadas condicionales (PENDIENTE)
        // Solo crea objeto coordenadas si existen lat y lng
    coordenadas: obs.lat && obs.lng ? {
      lat: obs.lat,  // lat → latitude (latitud)
      lng: obs.lng   // lng → longitude (longitud)
    } : null,        // Si no hay coordenadas, devuelve null
    
    // Validación
        // obsValid → observation validated (observación validada)
        // Si no existe, asumimos false (no validada)
    validado: obs.obsValid || false,
    
    // Datos adicionales
    codigoEspecie: obs.speciesCode,  // speciesCode → código único de especie
    idLocalidad: obs.locId           // locId → location ID (ID del lugar)
  }));
  // Cada objeto transformado se agrega al nuevo array
}

// =============================================================================================================================
// 2. FORMATEAR ESPECIES
// =============================================================================================================================
function formatSpecies(species) {
  
  // Transforma lista de especies crudas
  return species.map(s => ({
    // Información básica
    codigo: s.code,           // Código único (ej: "butbut")
    nombreComun: s.comName,   // Nombre común en español
    nombreCientifico: s.sciName, // Nombre científico en latín
    
    // Categoría y metadatos
    categoria: s.category,    // species, hybrid, spuh, etc.
    
    // Información taxonómica
        // Valores por defecto si la API no los proporciona
    familia: s.familyComName || 'No especificada',  // Nombre familia (ej: "Accipitridae")
    orden: s.order || 'No especificado'            // Orden taxonómico (ej: "Accipitriformes")
  }));
}

// =============================================================================================================================
// 3. FORMATEAR RESULTADOS DE BÚSQUEDA
// =============================================================================================================================
function formatSearchResults(results) {

  // Formatea resultados de búsqueda (similar a formatSpecies pero para búsquedas)
  return results.map(result => ({
    // Información esencial para búsqueda
    codigo: result.code,               // Para enlaces a detalles
    nombreComun: result.comName,       // Lo que el usuario buscó
    nombreCientifico: result.sciName,  // Información técnica
    
    // Metadatos para filtrado
    categoria: result.category,        // species, issf, etc.
    orden: result.order || 'No especificado',
    familia: result.familyComName || 'No especificada'
  }));
}

// =============================================================================================================================
// 4. FORMATEAR DETALLES DE ESPECIE
// =============================================================================================================================
function formatSpeciesDetail(speciesDetail) {

  // Formatea información detallada de una especie específica
  return {
    // Identificadores únicos
    codigo: speciesDetail.code,                // Código eBird
    nombreComun: speciesDetail.comName,        // Nombre común
    nombreCientifico: speciesDetail.sciName,   // Nombre científico
    
    // Información familiar detallada
    nombreFamilia: speciesDetail.familyComName,           // Nombre común familia
    nombreFamiliaCientifico: speciesDetail.familySciName, // Nombre científico familia
    
    // Clasificación taxonómica
    orden: speciesDetail.order,      // Orden (ej: "Passeriformes")
    categoria: speciesDetail.category // Categoría (ej: "species")
    
    // Esta función devuelve un objeto, no un array porque es para los detalles de una sola especie
  };
}

// =============================================================================================================================
// 5. FORMATEAR PUNTOS CALIENTES
// =============================================================================================================================
function formatHotspots(hotspots) {

  // Formatea puntos calientes (hotspots) de observación
    // hotspots puede ser: array, objeto único, null, o undefined
  const hotspotsArray = Array.isArray(hotspots) 
    ? hotspots                     // Si ya es array, úsalo
    : (hotspots ? [hotspots] : []); // Si es objeto, conviértelo a array
                                    // Si es null/undefined, array vacío
  
  // Transforma cada hotspot
  return hotspotsArray.map((h, index) => ({
    // Identificadores (con valores por defecto)
    id: h.locId || `hotspot_${index}`,  // locId → location ID
    nombre: h.name || `Punto de observación ${index + 1}`,
    
    // Coordenadas
    coordenadas: {
        // La API puede usar "latitude"/"longitude" o "lat"/"lng" (PENDIENTE)
        // Si no hay coordenadas, usa coordenadas por defecto de Ávila
      lat: h.latitude || h.lat || 40.65,    // Latitud por defecto: Ávila
      lng: h.longitude || h.lng || -4.68    // Longitud por defecto: Ávila
    },
    
    // Ubicación geográfica
    region: h.countryCode === 'ES' ? 'España' : (h.countryCode || 'ES'),
    subregion: h.subnational1Name || 'Castilla y León',
    
    // Estadísticas (con valores por defecto)
    especiesRegistradas: h.numSpeciesAllTime || 0,  // Total especies vistas
    ultimaObservacion: h.latestObsDt || 'No disponible' // Última observación
  }));
}

// Exportar las funciones
    // El controller las importará para formatear datos
module.exports = {
  formatObservations,      // Para observaciones
  formatSpecies,           // Para lista de especies
  formatSearchResults,     // Para resultados de búsqueda
  formatSpeciesDetail,     // Para detalles de especie
  formatHotspots          // Para puntos calientes
};