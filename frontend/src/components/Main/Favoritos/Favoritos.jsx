import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './Favoritos.css';

function Favoritos() {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [threatFilter, setThreatFilter] = useState('todos');
  const navigate = useNavigate();

  // Función para mostrar mensajes
  const showMessage = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#053f27ff',
      confirmButtonText: 'Aceptar',
      timer: icon === 'success' ? 2000 : undefined
    });
  };

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, []);

  // Filtrar favoritos cuando cambian los filtros
  useEffect(() => {
    let filtered = favorites;

    // Aplicar filtro de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(fav =>
        (fav.nombre_comun && fav.nombre_comun.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (fav.nombre_cientifico && fav.nombre_cientifico.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (fav.familia && fav.familia.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Aplicar filtro por estado de conservación
    if (threatFilter !== 'todos') {
      filtered = filtered.filter(fav => fav.nivel_amenaza === threatFilter);
    }
    
    setFilteredFavorites(filtered);
  }, [searchTerm, threatFilter, favorites]);

  // Cargar favoritos desde la API
  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        Swal.fire({
          title: 'No autenticado',
          text: 'Debes iniciar sesión para ver tus favoritos',
          icon: 'warning',
          confirmButtonColor: '#053f27ff',
          confirmButtonText: 'Ir a login'
        }).then(() => {
          navigate('/login');
        });
        return;
      }

      const response = await fetch('http://localhost:3001/favoritos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Respuesta de API:', result); // DEBUG
      
      if (result.success) {
        // AQUÍ ESTÁ LA CLAVE: Tu API devuelve los datos formateados por favorites.utils.js
        // La estructura es: result.data = array con objetos formateados
        const mappedFavorites = result.data.map(fav => {
          console.log('Favorito formateado:', fav); // DEBUG
          
          // Extraer información del ave
          const aveInfo = fav.ave_info || {};
          
          return {
            id_favorito: fav.id_favorito,
            id: fav.id_ave, // ID del ave
            nombre_comun: aveInfo.nombre_comun || fav.nombre_comun || 'Ave sin nombre',
            nombre_cientifico: aveInfo.nombre_cientifico || fav.nombre_cientifico || '',
            familia: aveInfo.familia || fav.familia || 'Familia desconocida',
            // IMPORTANTE: Las imágenes vienen en ave_info.imagen
            imagen: aveInfo.imagen || fav.imagen || null,
            nivel_amenaza: aveInfo.nivel_amenaza || fav.nivel_amenaza || 'LC',
            descripcion_corta: `Ave de la familia ${aveInfo.familia || 'desconocida'}`
          };
        });
        
        console.log('Favoritos procesados:', mappedFavorites); // DEBUG
        
        setFavorites(mappedFavorites);
        setFilteredFavorites(mappedFavorites);
        
        if (mappedFavorites.length === 0) {
          showMessage('info', 'No hay favoritos', 'Aún no tienes aves favoritas.');
        }
      } else {
        throw new Error(result.message || 'Error al cargar favoritos');
      }
      
    } catch (error) {
      console.error('Error cargando favoritos:', error);
      
      if (error.message.includes('sesión ha expirado')) {
        // Limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        
        Swal.fire({
          title: 'Sesión expirada',
          text: error.message,
          icon: 'warning',
          confirmButtonColor: '#053f27ff',
          confirmButtonText: 'Ir a login'
        }).then(() => {
          navigate('/login');
        });
      } else {
        showMessage('error', 'Error', error.message);
      }
      
      setFavorites([]);
      setFilteredFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar error en imagen
  const handleImageError = (e, birdName) => {
    console.log(`Error cargando imagen para: ${birdName}`);
    e.target.style.display = 'none';
    e.target.parentNode.innerHTML = `
      <div class="image-error-placeholder">
        <span>🦅</span>
        <p>Imagen no disponible</p>
      </div>
    `;
  };

  // Función para eliminar de favoritos
  const handleRemoveFavorite = async (favoriteId, birdName, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: '¿Eliminar de favoritos?',
      text: `¿Estás seguro de eliminar "${birdName}" de tus favoritos?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#053f27ff',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor, espera',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await fetch(`http://localhost:3001/favoritos/${favoriteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        Swal.close();
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Actualizar ambas listas
            setFavorites(prev => prev.filter(fav => fav.id_favorito !== favoriteId));
            setFilteredFavorites(prev => prev.filter(fav => fav.id_favorito !== favoriteId));
            
            showMessage('success', 'Eliminado', 'El ave se ha eliminado de tus favoritos');
          } else {
            throw new Error(result.message || 'Error al eliminar favorito');
          }
        } else if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else if (response.status === 404) {
          throw new Error('El favorito no existe o ya fue eliminado');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
      } catch (error) {
        console.error('Error eliminando favorito:', error);
        
        if (error.message.includes('sesión ha expirado')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          
          Swal.fire({
            title: 'Sesión expirada',
            text: error.message,
            icon: 'warning',
            confirmButtonColor: '#053f27ff',
            confirmButtonText: 'Ir a login'
          }).then(() => {
            navigate('/login');
          });
        } else {
          showMessage('error', 'Error', error.message);
        }
      }
    }
  };

  // Mostrar spinner de carga
  if (loading) {
    return (
      <div className="spinner-center">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="favoritos-container">
      <div className="favoritos-header">
        <h1>⭐ Mis Aves Favoritas</h1>
        <div className="favoritos-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, científico o familia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-btn"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          
          <select
            className="filter-select"
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="LC">LC - Preocupación menor</option>
            <option value="NT">NT - Casi amenazado</option>
            <option value="VU">VU - Vulnerable</option>
            <option value="EN">EN - En peligro</option>
            <option value="CR">CR - En peligro crítico</option>
          </select>
          
          <Link to="/navarrevisca" className="explore-btn">
            Explorar más aves
          </Link>
        </div>
        
        {favorites.length > 0 && (
          <div className="results-info">
            Mostrando <strong>{filteredFavorites.length}</strong> de <strong>{favorites.length}</strong> aves favoritas
            {searchTerm && (
              <span> para "<em>{searchTerm}</em>"</span>
            )}
            {threatFilter !== 'todos' && (
              <span> con estado "<em>{threatFilter}</em>"</span>
            )}
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-state">
            <div className="empty-icon">🦅</div>
            <h3>No tienes aves favoritas aún</h3>
            <p>Explora las aves de Navarrevisca y añade tus favoritas para verlas aquí.</p>
            <Link to="/navarrevisca" className="btn-primary">
              Explorar Aves de Navarrevisca
            </Link>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="no-results">
          <h3>No se encontraron resultados</h3>
          <p>No hay aves favoritas que coincidan con los filtros seleccionados</p>
          <button 
            className="btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setThreatFilter('todos');
            }}
          >
            Mostrar todas las favoritas
          </button>
        </div>
      ) : (
        <div className="favoritos-grid">
          {filteredFavorites.map((fav) => (
            <div 
              key={fav.id_favorito} 
              className="bird-card-fav"
              onClick={() => navigate(`/navarrevisca/detalle/${fav.id}`)}
            >
              {/* IMAGEN DEL AVE - USANDO LA IMAGEN REAL DE LA API */}
              <div className="bird-card-image">
                {fav.imagen ? (
                  <img 
                    src={fav.imagen} 
                    alt={fav.nombre_comun}
                    loading="lazy"
                    onError={(e) => handleImageError(e, fav.nombre_comun)}
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <span>🦅</span>
                    <p>Sin imagen</p>
                  </div>
                )}
                <div className="bird-card-badge">
                  ⭐ Favorita
                </div>
              </div>
              
              <div className="bird-card-content">
                <h3 className="bird-card-title">{fav.nombre_comun}</h3>
                <p className="bird-card-scientific">
                  <em>{fav.nombre_cientifico}</em>
                </p>
                
                <div className="bird-card-meta">
                  <span className="bird-card-family">{fav.familia}</span>
                  <span className={`bird-card-status status-${fav.nivel_amenaza}`}>
                    {fav.nivel_amenaza}
                  </span>
                </div>
                
                <p className="bird-card-desc">
                  {fav.descripcion_corta}
                </p>
                
                <div className="bird-card-actions">
                  <button 
                    onClick={(e) => handleRemoveFavorite(fav.id_favorito, fav.nombre_comun, e)}
                    className="remove-fav-btn"
                  >
                    🗑️ Eliminar de favoritos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoritos;