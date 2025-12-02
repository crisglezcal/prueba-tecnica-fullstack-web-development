import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyFavorites } from "../../../services/myApiService.js";
import './Favoritos.css';

function Favoritos() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await getMyFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    if (window.confirm('¿Eliminar este ave de favoritos?')) {
      try {
        await removeFromFavorites(favoriteId);
        setFavorites(favorites.filter(fav => fav.id_favorito !== favoriteId));
      } catch (error) {
        console.error('Error eliminando favorito:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando tus aves favoritas...</div>;
  }

  return (
    <div className="favoritos">
      <h1>⭐ Mis Aves Favoritas</h1>
      
      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>No tienes aves favoritas aún.</p>
          <Link to="/navarrevisca" className="btn btn-primary">
            Explorar Aves de Navarrevisca
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((fav) => (
            <div key={fav.id_favorito} className="favorite-card">
              <div className="favorite-header">
                <h3>{fav.ave_info?.nombre_comun}</h3>
                <button
                  onClick={() => handleRemoveFavorite(fav.id_favorito)}
                  className="remove-btn"
                  title="Eliminar de favoritos"
                >
                  ✕
                </button>
              </div>
              
              <p className="scientific-name">{fav.ave_info?.nombre_cientifico}</p>
              
              <div className="favorite-actions">
                <Link 
                  to={`/navarrevisca/detalle/${fav.id_ave}`}
                  className="btn btn-small"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;