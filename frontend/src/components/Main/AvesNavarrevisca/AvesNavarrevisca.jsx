import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './AvesNavarrevisca.css';

// Componente para mostrar la lista de aves de Navarrevisca
function AvesNavarrevisca() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);

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
        } else {
          showMessage('success', '¡Aves cargadas!', `Se cargaron ${avesArray.length} aves correctamente.`);
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
        
        // Si no hay aves, mostrar SweetAlert
      } catch (error) {
        console.error('Error:', error);
        Swal.close();
        showMessage('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
        setBirds([]);
      } finally {
        setLoading(false);
      }
    };

    // Llamar a la función para obtener las aves
    fetchBirds();
  }, []);

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

  // Mostrar SweetAlert si no hay aves después de cargar
  if (birds.length === 0 && !loading) {
    Swal.fire({
      title: 'No se encontraron aves',
      text: 'La base de datos está vacía o hubo un error de conexión.',
      icon: 'warning',
      confirmButtonColor: '#053f27ff',
      confirmButtonText: 'Reintentar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });

    // Mientras se muestra el SweetAlert, no renderizar nada
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

      <article className="birds-grid">
        {birds.map((bird) => (
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
                    // SweetAlert para error de imagen
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
              
              <span className="view-details">Ver detalles →</span>
            </div>
          </Link>
        ))}
      </article>
    </section>
  );
}

export default AvesNavarrevisca;