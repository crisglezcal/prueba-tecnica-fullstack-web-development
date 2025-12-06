import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './AvesNavarrevisca.css';

// Componente para mostrar la lista de aves de Navarrevisca
function AvesNavarrevisca() {
  const [birds, setBirds] = useState([]); // Estado 1 para almacenar todas las aves
  const [filteredBirds, setFilteredBirds] = useState([]); // Estado 2 para aves filtradas
  const [loading, setLoading] = useState(true); // Estado 3 para controlar el loading
  const [searchTerm, setSearchTerm] = useState(''); // Estado 4 para el término de búsqueda
  const [threatFilter, setThreatFilter] = useState('todos'); // Estado 5 para el filtro de amenaza
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado 6 para autenticación

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Suponiendo que el token se guarda en localStorage
    const userRole = localStorage.getItem('userRole'); // Rol del usuario
    setIsAuthenticated(!!token && (userRole === 'user' || userRole === 'admin')); // Solo usuarios autenticados
  }, []);

  // Función para mostrar mensajes con SweetAlert
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

  // Filtrar aves cuando cambian los filtros
  useEffect(() => {
    let filtered = birds;

    // Aplicar filtro de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(bird =>
        bird.nombre_comun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bird.nombre_cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bird.familia.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por estado de conservación
    if (threatFilter !== 'todos') {
      filtered = filtered.filter(bird => bird.nivel_amenaza === threatFilter);
    }
    // Actualizar el estado de aves filtradas
    setFilteredBirds(filtered);
  }, [searchTerm, threatFilter, birds]);

  // useEffect para cargar las aves al montar el componente
  useEffect(() => {
    const fetchBirds = async () => {
      try {
        // Mostrar loading con SweetAlert
        Swal.fire({
          title: 'Cargando aves...',
          text: 'Por favor, espera',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Llamada a la API para obtener las aves
        const response = await fetch('http://localhost:3001/aves/navarrevisca');

        // Verificar si la respuesta es correcta
        if (!response.ok) {
          throw new Error('Error al cargar las aves');
        }

        // Obtener los datos en formato JSON
        const result = await response.json();
        const avesArray = result.data || [];
        
        // Cerrar el loading
        Swal.close();
        
        // Mostrar mensaje según si se encontraron aves o no
        if (avesArray.length === 0) {
          showMessage('info', 'Base de datos vacía', 'No se encontraron aves en la base de datos.');
        }

        // Mapear los datos recibidos a la estructura esperada
        const mappedBirds = avesArray.map(bird => ({
          id: bird.id,
          nombre_comun: bird.nombre_comun,
          nombre_cientifico: bird.nombre_cientifico,
          familia: bird.familia,
          nivel_amenaza: bird.nivel_amenaza,
          descripcion_corta: bird.descripcion_corta,
          imagen: bird.imagen
        }));

        // Actualizar el estado con las aves mapeadas
        setBirds(mappedBirds);
        setFilteredBirds(mappedBirds);
        
      } catch (error) {
        Swal.close();
        showMessage('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
        setBirds([]);
        setFilteredBirds([]);
      } finally {
        setLoading(false);
      }
    };

    // Llamar a la función para obtener las aves
    fetchBirds();
  }, []);

    // Función para crear nueva ave (solo usuarios autenticados)
  const handleCreate = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Acceso restringido',
        text: 'Debes iniciar sesión para crear nuevas aves',
        icon: 'warning',
        confirmButtonColor: '#053f27ff'
      }).then(() => {
        window.location.href = '/login';
      });
      return;
    }

    // Mostrar formulario de creación con SweetAlert
    Swal.fire({
      title: 'Nueva ave',
      html: `
        <input type="text" id="nombre_comun" class="swal2-input" placeholder="Nombre común" required>
        <input type="text" id="nombre_cientifico" class="swal2-input" placeholder="Nombre científico" required>
        <input type="text" id="familia" class="swal2-input" placeholder="Familia" required>
        <select id="nivel_amenaza" class="swal2-input" required>
          <option value="">Seleccione nivel de amenaza</option>
          <option value="LC">LC - Preocupación menor</option>
          <option value="NT">NT - Casi amenazado</option>
          <option value="VU">VU - Vulnerable</option>
          <option value="EN">EN - En peligro</option>
          <option value="CR">CR - En peligro crítico</option>
        </select>
        <textarea id="descripcion_corta" class="swal2-textarea" placeholder="Descripción (mínimo 20 caracteres)" required></textarea>
        <input type="text" id="imagen" class="swal2-input" placeholder="URL de la imagen" required>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#053f27ff',
      preConfirm: () => {
        const nombre_comun = document.getElementById('nombre_comun').value;
        const nombre_cientifico = document.getElementById('nombre_cientifico').value;
        const familia = document.getElementById('familia').value;
        const nivel_amenaza = document.getElementById('nivel_amenaza').value;
        const descripcion_corta = document.getElementById('descripcion_corta').value;
        const imagen = document.getElementById('imagen').value;

        if (!nombre_comun || !nombre_cientifico || !familia || !nivel_amenaza || !descripcion_corta || !imagen) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        if (descripcion_corta.length < 20) {
          Swal.showValidationMessage('La descripción debe tener al menos 20 caracteres');
          return false;
        }

        if (!imagen.startsWith('http://') && !imagen.startsWith('https://')) {
          Swal.showValidationMessage('La URL debe comenzar con http:// o https://');
          return false;
        }

        return {
          nombre_comun,
          nombre_cientifico,
          familia,
          nivel_amenaza,
          descripcion_corta,
          imagen
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('authToken');
          
          // Estructura de datos según tu backend
          const birdData = {
            common_name: result.value.nombre_comun,
            scientific_name: result.value.nombre_cientifico,
            order: "Passeriformes", // Campo obligatorio en tu validación
            family: result.value.familia,
            threat_level: result.value.nivel_amenaza,
            description: result.value.descripcion_corta,
            image: result.value.imagen
          };

          Swal.fire({
            title: 'Creando...',
            text: 'Por favor, espera',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          // Llamada a la API para crear la nueva ave
          const response = await fetch('http://localhost:3001/aves/navarrevisca', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(birdData)
          });

          Swal.close();

          if (response.ok) {
            // Recargar la lista de aves
            const fetchResponse = await fetch('http://localhost:3001/aves/navarrevisca');
            const result = await fetchResponse.json();
            const avesArray = result.data || [];
            
            const mappedBirds = avesArray.map(bird => ({
              id: bird.id,
              nombre_comun: bird.nombre_comun,
              nombre_cientifico: bird.nombre_cientifico,
              familia: bird.familia,
              nivel_amenaza: bird.nivel_amenaza,
              descripcion_corta: bird.descripcion_corta,
              imagen: bird.imagen
            }));

            setBirds(mappedBirds);
            setFilteredBirds(mappedBirds);
            
            Swal.fire({
              title: '¡Éxito!',
              text: 'Ave creada correctamente',
              icon: 'success',
              confirmButtonColor: '#053f27ff',
              timer: 2000
            });
          } else {
            // Mejor manejo de errores
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: `No se pudo crear el ave: ${error.message}`,
            icon: 'error',
            confirmButtonColor: '#053f27ff'
          });
          console.error('Error creando ave:', error);
        }
      }
    });
  };

  // Mostrar spinner mientras se cargan las aves
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

  // Renderizar la lista de aves
  return (
    <section className="aves-navarrevisca">
      <article className="page-header">
        <h1>Avifauna de Navarrevisca</h1>
      </article>

      {/* Controles de búsqueda y filtro */}
      <div className="search-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="btn-clear-search"
              onClick={() => setSearchTerm('')}
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-container">
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
        </div>

        {isAuthenticated && (
          <button 
            className="btn btn-primary"
            onClick={handleCreate}
          >
            Nueva ave
          </button>
        )}
      </div>

      {/* Información de resultados */}
      {birds.length > 0 && (
        <div className="search-results-info">
          <p>
            Mostrando <strong>{filteredBirds.length}</strong> de <strong>{birds.length}</strong> aves
            {searchTerm && (
              <span> para "<em>{searchTerm}</em>"</span>
            )}
            {threatFilter !== 'todos' && (
              <span> con estado "<em>{threatFilter}</em>"</span>
            )}
          </p>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {birds.length > 0 && filteredBirds.length === 0 ? (
        <div className="no-results-message">
          <h3>No se encontraron resultados</h3>
          <p>No hay aves que coincidan con los filtros seleccionados</p>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setThreatFilter('todos');
            }}
          >
            Mostrar todas las aves
          </button>
        </div>
      ) : birds.length === 0 ? (
        <div className="no-birds-message">
          <h3>No hay aves en la base de datos</h3>
          <p>{isAuthenticated ? 'Usa el botón "Nueva ave" para agregar la primera ave' : 'Contacta con un administrador para agregar aves'}</p>
        </div>
      ) : (
        <article className="birds-grid">
          {filteredBirds.map((bird) => (
            <Link 
              key={bird.id} 
              to={`/navarrevisca/detalle/${bird.id}`}
              className="bird-card"
            >
              <div className="bird-image">
                {bird.imagen ? (
                  <img 
                    src={bird.imagen} 
                    alt={bird.nombre_comun}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      Swal.fire({
                        title: 'Imagen no disponible',
                        text: `La imagen de ${bird.nombre_comun} no se pudo cargar`,
                        icon: 'warning',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                      });
                    }}
                  />
                ) : null}
                {(!bird.imagen || bird.imagen === '') && (
                  <div className="no-image-placeholder">🦅</div>
                )}
              </div>
              
              <div className="bird-info">
                <h3>{bird.nombre_comun}</h3>
                <p className="scientific-name">
                  <em>{bird.nombre_cientifico}</em>
                </p>
                
                <div className="bird-meta">
                  <span className="family">{bird.familia}</span>
                  <span className={`threat-level threat-${bird.nivel_amenaza}`}>
                    {bird.nivel_amenaza}
                  </span>
                </div>
                
                <p className="bird-description">{bird.descripcion_corta}</p>
                
                <span className="view-details">Ver detalles</span>
              </div>
            </Link>
          ))}
        </article>
      )}
    </section>
  );
}

export default AvesNavarrevisca;