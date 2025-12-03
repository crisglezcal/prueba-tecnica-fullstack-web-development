/* 
🟢 MY API SERVICE → myApiService.js
    * Servicio para TU base de datos PostgreSQL
    * Operaciones CRUD completas de tus tablas
*/

import api from './api.js';

// =================================================================================================
// 1. AVES DE NAVARREVISCA (tu tabla navarrevisca_birds)
// =================================================================================================

/**
 * Obtener todas las aves de Navarrevisca
 * GET /aves/navarrevisca
 */
export const getNavarreviscaBirds = async () => {
  try {
    const response = await api.get('/aves/navarrevisca');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo aves de Navarrevisca:', error);
    throw error;
  }
};

/**
 * Obtener detalle de un ave específica
 * GET /aves/navarrevisca/detalle/:id
 */
export const getBirdDetail = async (birdId) => {
  try {
    const response = await api.get(`/aves/navarrevisca/detalle/${birdId}`);
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo detalle del ave ${birdId}:`, error);
    throw error;
  }
};

/**
 * Añadir ave a favoritos
 * POST /aves/navarrevisca/detalle/:id/favoritos
 */
export const addToFavorites = async (birdId) => {
  try {
    const response = await api.post(`/aves/navarrevisca/detalle/${birdId}/favoritos`);
    return response.data;
  } catch (error) {
    console.error(`Error añadiendo ave ${birdId} a favoritos:`, error);
    throw error;
  }
};

// =================================================================================================
// 2. FAVORITOS (tu tabla user_favorites)
// =================================================================================================

/**
 * Obtener mis aves favoritas
 * GET /favoritos
 */
export const getMyFavorites = async () => {
  try {
    const response = await api.get('/favoritos');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    throw error;
  }
};

/**
 * Eliminar ave de favoritos
 * DELETE /favoritos/:id
 */
export const removeFromFavorites = async (favoriteId) => {
  try {
    const response = await api.delete(`/favoritos/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando favorito ${favoriteId}:`, error);
    throw error;
  }
};

// =================================================================================================
// 3. ADMINISTRADOR (CRUD de tu BD)
// =================================================================================================

/**
 * Crear nueva ave
 * POST /admin/aves
 */
export const createBird = async (birdData) => {
  try {
    const response = await api.post('/admin/aves', birdData);
    return response.data;
  } catch (error) {
    console.error('Error creando ave:', error);
    throw error;
  }
};

/**
 * Actualizar ave existente
 * PUT /admin/aves/:id
 */
export const updateBird = async (birdId, birdData) => {
  try {
    const response = await api.put(`/admin/aves/${birdId}`, birdData);
    return response.data;
  } catch (error) {
    console.error(`Error actualizando ave ${birdId}:`, error);
    throw error;
  }
};

/**
 * Eliminar ave
 * DELETE /admin/aves/:id
 */
export const deleteBird = async (birdId) => {
  try {
    const response = await api.delete(`/admin/aves/${birdId}`);
    return response.data;
  } catch (error) {
    console.error(`Error eliminando ave ${birdId}:`, error);
    throw error;
  }
};