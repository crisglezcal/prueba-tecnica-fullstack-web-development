/* 
📑 MODEL → navarreviscaDetail.model.js
    * Modelo para vista detalle y favoritos
    * Variables y funciones en inglés, comentarios en castellano
*/

// =================================================================================================
// 1. FORMATEAR DETALLE COMPLETO DE UN AVE 
// =================================================================================================

function formatAveDetailComplete(birdFromDb, userFavorites = []) {
  
  if (!birdFromDb) return null;
  
  const isFavorite = userFavorites.some(fav => 
    fav.id_bird === birdFromDb.id_bird
  );
  
  return {
    id: birdFromDb.id_bird,
    nombre_comun: birdFromDb.common_name,
    nombre_cientifico: birdFromDb.scientific_name,
    orden: birdFromDb.order,
    familia: birdFromDb.family,
    descripcion_completa: birdFromDb.description,
    imagen: birdFromDb.image,
    nivel_amenaza: birdFromDb.threat_level,
    es_favorito: isFavorite,
    url_favoritos: `/aves/navarrevisca/detalle/${birdFromDb.id_bird}/favoritos`
  };
}

// =================================================================================================
// 2. FORMATEAR RESPUESTA PARA FAVORITOS
// =================================================================================================

function formatFavoritesResponse(favoriteFromDb) {
  
  if (!favoriteFromDb) return null;
  
  return {
    id_favorito: favoriteFromDb.id,
    id_ave: favoriteFromDb.bird_id,
    id_usuario: favoriteFromDb.user_id,
    mensaje: 'Ave añadida a favoritos correctamente',
    timestamp: new Date().toISOString(),
    fecha_creacion: favoriteFromDb.created_at
  };
}

// =================================================================================================
// 3. FORMATEAR DATOS PARA CREAR FAVORITO
// =================================================================================================

function formatFavoriteForCreate(userId, birdId) {
  
  return {
    user_id: userId,
    bird_id: birdId,
    created_at: new Date()
  };
}

// Exportar funciones
module.exports = {
  formatAveDetailComplete,
  formatFavoritesResponse,
  formatFavoriteForCreate
};