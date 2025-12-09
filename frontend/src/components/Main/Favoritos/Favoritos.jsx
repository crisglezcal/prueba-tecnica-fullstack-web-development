import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './Favoritos.css';

const VITE_API_URL = import.meta.VITE_API_URL

// Definir el componente principal Favoritos
function Favoritos() {
  
  const [favorites, setFavorites] = useState([]); // Estado 1 para almacenar todas las aves favoritas
  const [filteredFavorites, setFilteredFavorites] = useState([]); // Estado 2 para almacenar las aves favoritas filtradas (según búsqueda/filtros)
  const [loading, setLoading] = useState(true); // Estado 3 para controlar si se está cargando información
  const [searchTerm, setSearchTerm] = useState(''); // Estado 4 para almacenar el término de búsqueda
  const [threatFilter, setThreatFilter] = useState('todos'); // Estado 5 para almacenar el filtro de amenaza seleccionado
  
  // Hook para navegar entre rutas
  const navigate = useNavigate();

  // Función auxiliar para mostrar mensajes
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

  // Efecto para cargar las aves favoritas cuando el componente se monta
  useEffect(() => {
    loadFavorites();
  }, []);

  // Efecto para filtrar las aves favoritas cuando cambian los filtros o el término de búsqueda
  useEffect(() => {

    // Comenzar con todas las favoritas
    let filtered = favorites;

    // Si hay un término de búsqueda, aplicar filtro de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(fav =>
        // Buscar en nombre común (si existe)
        (fav.nombre_comun && fav.nombre_comun.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // Buscar en nombre científico (si existe)
        (fav.nombre_cientifico && fav.nombre_cientifico.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // Buscar en familia (si existe)
        (fav.familia && fav.familia.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Si hay un filtro de amenaza activo (no es "todos"), aplicar filtro por nivel de amenaza
    if (threatFilter !== 'todos') {
      filtered = filtered.filter(fav => fav.nivel_amenaza === threatFilter);
    }
    
    // Actualizar el estado con las favoritas filtradas
    setFilteredFavorites(filtered);
  }, [searchTerm, threatFilter, favorites]); 

  // Función asíncrona para cargar las aves favoritas desde la API
  const loadFavorites = async () => {
    try {
      // Activar estado de carga
      setLoading(true);
      
      // Obtener token de autenticación del almacenamiento local
      const token = localStorage.getItem('authToken');
      
      // Si no hay token, mostrar mensaje de error y redirigir al login
      if (!token) {
        Swal.fire({
          title: 'No autenticado',
          text: 'Debes iniciar sesión para ver tus favoritos',
          icon: 'warning',
          confirmButtonColor: '#053f27ff',
          confirmButtonText: 'Ir a login'
        }).then(() => {
          navigate('/login');  // Redirigir a la página de login
        });
        return;  // Salir de la función
      }

      // Hacer petición GET a la API para obtener las aves favoritas
      const response = await fetch(`${VITE_API_URL}/favoritos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'
        }
      });

      // Verificar si la respuesta no es exitosa
      if (!response.ok) {
        // Si el error es 401 (no autorizado), manejar sesión expirada
        if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        // Para otros errores HTTP, lanzar error con código de estado
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Convertir respuesta a JSON
      const result = await response.json();
      console.log('Respuesta de API:', result); // DEBUG: Mostrar respuesta para depuración
      
      // Verificar si la API devolvió éxito
      if (result.success) {
        // Mapear los datos recibidos de la API al formato necesario para el frontend
        const mappedFavorites = result.data.map(fav => {
          console.log('Favorito formateado:', fav);
          
          // Extraer información del ave 
          const aveInfo = fav.ave_info || {};
          
          // Devolver objeto con estructura uniforme para el frontend
          return {
            id_favorito: fav.id_favorito,  
            id: fav.id_ave,  
            nombre_comun: aveInfo.nombre_comun || fav.nombre_comun || 'Ave sin nombre',
            nombre_cientifico: aveInfo.nombre_cientifico || fav.nombre_cientifico || '',
            familia: aveInfo.familia || fav.familia || 'Familia desconocida',
            imagen: aveInfo.imagen || fav.imagen || null,
            nivel_amenaza: aveInfo.nivel_amenaza || fav.nivel_amenaza || 'LC',
            descripcion_corta: `Ave de la familia ${aveInfo.familia || 'desconocida'}`
          };
        });
        
        console.log('Favoritos procesados:', mappedFavorites); 
        
        // Actualizar estados con las favoritas procesadas
        setFavorites(mappedFavorites);
        setFilteredFavorites(mappedFavorites);
        
        // Si no hay favoritos, mostrar mensaje informativo
        if (mappedFavorites.length === 0) {
          showMessage('info', 'No hay favoritos', 'Aún no tienes aves favoritas.');
        }
      } else {
        // Si la API no devolvió éxito, lanzar error con el mensaje de la API
        throw new Error(result.message || 'Error al cargar favoritos');
      }
      
    } catch (error) {
      // Capturar y manejar errores
      console.error('Error cargando favoritos:', error);
      
      // Si el error es de sesión expirada
      if (error.message.includes('sesión ha expirado')) {
        // Limpiar todos los datos de autenticación del localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        
        // Mostrar mensaje de sesión expirada y redirigir al login
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
        // Para otros errores, mostrar mensaje genérico
        showMessage('error', 'Error', error.message);
      }
      
      // Limpiar estados en caso de error
      setFavorites([]);
      setFilteredFavorites([]);
    } finally {
      // Desactivar estado de carga (siempre se ejecuta, haya éxito o error)
      setLoading(false);
    }
  };

  // Función para manejar errores al cargar imágenes
  const handleImageError = (e, birdName) => {
    // Registrar error en consola
    console.log(`Error cargando imagen para: ${birdName}`);
    // Ocultar la imagen que falló
    e.target.style.display = 'none';
    // Reemplazar por un placeholder HTML
    e.target.parentNode.innerHTML = `
      <div class="image-error-placeholder">
        <p>Imagen no disponible</p>
      </div>
    `;
  };

  // Función para eliminar un ave de favoritos
  const handleRemoveFavorite = async (favoriteId, birdName, e) => {
    // Prevenir comportamiento por defecto y propagación del evento
    e.preventDefault();
    e.stopPropagation();
    
    // Mostrar modal de confirmación antes de eliminar
    const result = await Swal.fire({
      title: '¿Eliminar de favoritos?',
      text: `¿Estás seguro de eliminar "${birdName}" de tus favoritos?`,
      icon: 'question',
      showCancelButton: true,  
      confirmButtonColor: 'rgba(172, 123, 25, 1)',  
      cancelButtonColor: '#053f27ff',  
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true  
    });

    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      try {
        // Obtener token de autenticación
        const token = localStorage.getItem('authToken');
        
        // Mostrar modal de carga mientras se procesa
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor, espera',
          allowOutsideClick: false,  
          didOpen: () => {
            Swal.showLoading();  
          }
        });

        // Hacer petición DELETE a la API para eliminar el favorito
        const response = await fetch(`${VITE_API_URL}/favoritos/${favoriteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Cerrar modal de carga
        Swal.close();
        
        // Verificar si la respuesta es exitosa
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Actualizar lista de favoritos filtrando el eliminado
            setFavorites(prev => prev.filter(fav => fav.id_favorito !== favoriteId));
            setFilteredFavorites(prev => prev.filter(fav => fav.id_favorito !== favoriteId));
            
            // Mostrar mensaje de éxito
            showMessage('success', 'Eliminado', 'El ave se ha eliminado de tus favoritos');
          } else {
            // Si la API no devolvió éxito, lanzar error
            throw new Error(result.message || 'Error al eliminar favorito');
          }
        } else if (response.status === 401) {
          // Manejar error de autenticación
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else if (response.status === 404) {
          // Manejar error de recurso no encontrado
          throw new Error('El favorito no existe o ya fue eliminado');
        } else {
          // Para otros errores HTTP, obtener mensaje de error
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
      } catch (error) {
        // Capturar y manejar errores en la eliminación
        console.error('Error eliminando favorito:', error);
        
        // Si el error es de sesión expirada
        if (error.message.includes('sesión ha expirado')) {
          // Limpiar datos de autenticación
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          
          // Mostrar mensaje y redirigir al login
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
          // Para otros errores, mostrar mensaje
          showMessage('error', 'Error', error.message);
        }
      }
    }
  };

  // Si está cargando, mostrar spinner
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

  // Renderizar interfaz principal
  return (
    <section className="favoritos-container">
      <article className="favoritos-header">
        <h1>Mis aves favoritas</h1>
        <div className="favoritos-controls">
          {/* Campo de búsqueda */}
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar por nombre, científico o familia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}  // Actualizar término de búsqueda
            />
            {/* Botón para limpiar búsqueda (solo visible cuando hay texto) */}
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
          
          {/* Selector de filtro por estado de conservación */}
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
          
          {/* Enlace para explorar más aves */}
          <Link to="/navarrevisca" className="explore-btn">
            Explorar más aves
          </Link>
        </div>
        
        {/* Información de resultados (solo visible si hay favoritos) */}
        {favorites.length > 0 && (
          <div className="results-info">
            Mostrando <strong>{filteredFavorites.length}</strong> de <strong>{favorites.length}</strong> aves favoritas
            {/* Mostrar término de búsqueda si existe */}
            {searchTerm && (
              <span> para "<em>{searchTerm}</em>"</span>
            )}
            {/* Mostrar filtro aplicado si no es "todos" */}
            {threatFilter !== 'todos' && (
              <span> con estado "<em>{threatFilter}</em>"</span>
            )}
          </div>
        )}
      </article>

      {/* Renderizado condicional basado en el estado de las favoritas */}
      {favorites.length === 0 ? (
        // Estado vacío: no hay aves favoritas
        <article className="empty-favorites">
          <div className="empty-state">
            <h3>¿No tienes aves favoritas aún?</h3>
            <p>Explora las aves de Navarrevisca y añade tus favoritas para verlas aquí</p>
            <Link to="/navarrevisca" className="btn-primary">
              Explorar aves de Navarrevisca
            </Link>
          </div>
        </article>
      ) : filteredFavorites.length === 0 ? (
        // Estado sin resultados de búsqueda/filtro
        <article className="no-results">
          <h3>No se encontraron resultados</h3>
          <p>No hay aves favoritas que coincidan con los filtros seleccionados</p>
          <button 
            className="btn-secondary"
            onClick={() => {
              // Limpiar filtros al hacer clic
              setSearchTerm('');
              setThreatFilter('todos');
            }}
          >
            Mostrar todas las favoritas
          </button>
        </article>
      ) : (
        // Estado normal: mostrar grid de aves favoritas
        <article className="favoritos-grid">
          {/* Mapear cada ave favorita filtrada a una tarjeta */}
          {filteredFavorites.map((fav) => (
            <div 
              key={fav.id_favorito}  
              className="bird-card-fav"
              onClick={() => navigate(`/navarrevisca/detalle/${fav.id}`)}  // Navegar a detalle al hacer clic
            >
              {/* Contenedor de la imagen del ave */}
              <div className="bird-card-image">
                {/* Mostrar imagen si existe, o placeholder si no */}
                {fav.imagen ? (
                  <img 
                    src={fav.imagen} 
                    alt={fav.nombre_comun}
                    loading="lazy"  
                    onError={(e) => handleImageError(e, fav.nombre_comun)}  
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <p>Sin imagen</p>
                  </div>
                )}
                {/* Badge que indica que es favorita */}
                <div className="bird-card-badge">
                  ⭐ Favorita
                </div>
              </div>
              
              {/* Contenido informativo de la tarjeta */}
              <div className="bird-card-content">
                <h3 className="bird-card-title">{fav.nombre_comun}</h3>
                <p className="bird-card-scientific">
                  <em>{fav.nombre_cientifico}</em>
                </p>
                
                {/* Familia y estado de conservación */}
                <div className="bird-card-meta">
                  <span className="bird-card-family">{fav.familia}</span>
                  <span className={`bird-card-status status-${fav.nivel_amenaza}`}>
                    {fav.nivel_amenaza}
                  </span>
                </div>
                
                {/* Descripción corta */}
                <p className="bird-card-desc">
                  {fav.descripcion_corta}
                </p>
                
                {/* Acciones: botón para eliminar de favoritos */}
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
        </article>
      )}
    </section>
  );
}

// Exportar el componente para poder usarlo en otros archivos
export default Favoritos;