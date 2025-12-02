/* 
📑 MODEL → navarrevisca.model.js
    * Modelo para formatear datos de la tabla navarrevisca_birds
    * TODOS los campos son requeridos (NOT NULL)
*/

// =============================================================================================================================
// 1. FORMATEAR LISTA DE AVES PARA RESPUESTA GET
// =============================================================================================================================

function formatAvesList(avesFromDb) {

  // Recibe: Array de objetos de PostgreSQL
  // Devuelve: Array formateado para frontend
  
  return avesFromDb.map(ave => ({
    id: ave.id_bird,                     
    nombre_comun: ave.common_name,       
    nombre_cientifico: ave.scientific_name, 
    orden: ave.order,                    
    familia: ave.family,                 
    descripcion_corta: truncateText(ave.description, 150), 
    imagen: ave.image,                   
    nivel_amenaza: ave.threat_level,     
    tiene_imagen: !!ave.image,
    url_detalle: `/aves/navarrevisca/detalle/${ave.id_bird}`
  }));
}

// =============================================================================================================================
// 2. FORMATEAR UN AVE INDIVIDUAL PARA DETALLES
// =============================================================================================================================

function formatAveDetail(aveFromDb) {

  // Recibe: Un objeto ave de PostgreSQL
  // Devuelve: Objeto formateado para vista detalle
  
  if (!aveFromDb) return null;
  
  return {
    id: aveFromDb.id_bird,
    nombre_comun: aveFromDb.common_name,
    nombre_cientifico: aveFromDb.scientific_name,
    orden: aveFromDb.order,
    familia: aveFromDb.family,
    descripcion_completa: aveFromDb.description,
    imagen: aveFromDb.image,
    nivel_amenaza: aveFromDb.threat_level,
    metadata: {
      tiene_descripcion: !!aveFromDb.description,
      tiene_imagen: !!aveFromDb.image,
      nivel_amenaza_codigo: getThreatLevelCode(aveFromDb.threat_level)
    }
  };
}

// =============================================================================================================================
// 3. FORMATEAR DATOS PARA CREAR NUEVA AVE (TODOS REQUERIDOS)
// =============================================================================================================================

function formatAveForCreate(aveData) {

  // Recibe: Datos del frontend (YA VALIDADOS)
  // Devuelve: Objeto listo para INSERT SQL
  // TODOS los campos son requeridos
  
  return {
    common_name: aveData.common_name.trim(),
    scientific_name: aveData.scientific_name.trim(),
    order: aveData.order.trim(),
    family: aveData.family.trim(),
    description: aveData.description.trim(),
    image: aveData.image.trim(),
    threat_level: aveData.threat_level 
  };
}

// =============================================================================================================================
// 4. FORMATEAR RESPUESTA DESPUÉS DE CREAR
// =============================================================================================================================

function formatCreatedAve(aveFromDb) {

  // Recibe: Resultado de INSERT
  // Devuelve: Respuesta formateada para frontend
  
  return {
    id: aveFromDb.id_bird,
    nombre_comun: aveFromDb.common_name,
    nombre_cientifico: aveFromDb.scientific_name,
    mensaje: `Ave "${aveFromDb.common_name}" creada exitosamente`,
    timestamp: new Date().toISOString()
  };
}

// =============================================================================================================================
// FUNCIONES AUXILIARES PRIVADAS
// =============================================================================================================================

// Acortar texto para vista lista
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength) + '...';
}

// Convertir nivel de amenaza a código para colores frontend
function getThreatLevelCode(threat_level) {
  const threatLevels = {
    'EX': 'extinto',                    // Extinto (⚫)
    'CR': 'peligro-critico',            // En peligro crítico (🔴)
    'EN': 'en-peligro',                 // En peligro (🟣)
    'VU': 'vulnerable',                 // Vulnerable (🟠)
    'NT': 'casi-amenazado',             // Casi amenazado (🟡)
    'LC': 'preocupacion-menor'          // Preocupación menor (🟢)
  };
  
  return threatLevels[threat_level] || 'no-evaluado';
}

// Exportar todas las funciones del modelo
module.exports = {
  formatAvesList,
  formatAveDetail,
  formatAveForCreate,
  formatCreatedAve
};