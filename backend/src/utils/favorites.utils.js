/* 
📑 FAVORITES MODEL → favorites.model.js
    * Modelo para formatear datos de favoritos
*/

// ======================================================================================================================================
// 1. FORMATEAR LISTA DE FAVORITOS
// ======================================================================================================================================

function formatFavoritesList(favoritesFromDb) {
  
  // Si no hay favoritos, devolver array vacío
  if (!favoritesFromDb || !Array.isArray(favoritesFromDb)) {
    return [];
  }
  
  return favoritesFromDb.map(fav => ({
    id_favorito: fav.id_favbird,
    id_ave: fav.id_bird,
    id_usuario: fav.id_user,
    ave_info: {
      nombre_comun: fav.common_name,
      nombre_cientifico: fav.scientific_name,
      familia: fav.family,
      imagen: fav.image,
      nivel_amenaza: fav.threat_level
    },
    url_detalle: `/aves/navarrevisca/detalle/${fav.id_bird}`,
    url_eliminar: `/favoritos/${fav.id_favbird}`
  }));
}

// ======================================================================================================================================
// 2. FORMATEAR RESPUESTA DE ELIMINACIÓN
// ======================================================================================================================================

function formatRemoveResponse(favoriteId, userId) {
  
  return {
    id_favorito_eliminado: favoriteId,
    id_usuario: userId,
    mensaje: 'Ave eliminada de favoritos correctamente',
    timestamp: new Date().toISOString(),
    accion: 'eliminar_favorito'
  };
}

// Exportar funciones
module.exports = {
  formatFavoritesList,
  formatRemoveResponse
};