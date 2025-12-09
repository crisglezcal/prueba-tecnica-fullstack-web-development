import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import "../DetalleAveNavarrevisca/DetalleAveNavarrevisca.css";

const VITE_API_URL = import.meta.VITE_API_URL

// Definir el componente DetalleAveNavarrevisca
function DetalleAveNavarrevisca() {

  // Obtener el parámetro 'id' de la URL usando useParams
  const { id } = useParams();
  // Hook para navegar programáticamente entre rutas
  const navigate = useNavigate();

  // Estado 1 para almacenar los datos del ave
  const [bird, setBird] = useState(null);
  // Estado 2 para controlar si se está cargando la información
  const [loading, setLoading] = useState(true);
  // Estado 3 para controlar si el ave está marcada como favorita
  const [isFavorite, setIsFavorite] = useState(false);

  // Efecto para cargar los detalles del ave cuando el componente se monta o cambia el ID
  useEffect(() => {
    // Función asíncrona para obtener los detalles del ave
    const fetchBirdDetail = async () => {
      try {
        // Activar estado de carga
        setLoading(true);
        // Hacer petición GET a la API para obtener detalles del ave específica
        const response = await fetch(`${VITE_API_URL}:3001/aves/navarrevisca/detalle/${id}`);
        
        // Verificar si la respuesta no es exitosa
        if (!response.ok) throw new Error(`Error ${response.status}`);
        
        // Convertir respuesta a JSON
        const result = await response.json();
        
        // Si la API devolvió éxito, actualizar el estado con los datos
        if (result.success) {
          setBird({
            id: result.data.id,  
            nombre_comun: result.data.nombre_comun,  
            nombre_cientifico: result.data.nombre_cientifico,  
            orden: result.data.orden,  
            familia: result.data.familia,  
            descripcion_completa: result.data.descripcion_completa,  
            imagen: result.data.imagen,  
            nivel_amenaza: result.data.nivel_amenaza,  
            es_favorito: result.data.es_favorito || false  
          });
          // Actualizar estado de favorito
          setIsFavorite(result.data.es_favorito || false);
        }
      } catch (error) {
        // Mostrar error modal si hay un problema
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonColor: '#053f27ff'
        });
      } finally {
        // Desactivar estado de carga (siempre se ejecuta)
        setLoading(false);
      }
    };

    // Llamar a la función para cargar los detalles
    fetchBirdDetail();
  }, [id]);  // Se ejecuta cuando cambia el ID

  // Función para añadir el ave a favoritos
  const handleAddToFavorites = async () => {
    try {

      // Obtener token de autenticación del localStorage
      const token = localStorage.getItem('authToken');
      
      // Si no hay token, mostrar mensaje y redirigir al login
      if (!token) {
        Swal.fire({
          title: 'No autenticado',
          text: 'Debes iniciar sesión para añadir a favoritos',
          icon: 'warning',
          confirmButtonColor: '#053f27ff',
          confirmButtonText: 'Ir a login'
        }).then(() => navigate('/login'));  // Redirigir a login después de cerrar modal
        return;  // Salir de la función
      }

      // Hacer petición POST a la API para añadir a favoritos
      const response = await fetch(`${VITE_API_URL}:3001/aves/navarrevisca/detalle/${id}/favoritos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Enviar token en el header
          'Content-Type': 'application/json'
        }
      });

      // Convertir respuesta a JSON
      const data = await response.json();
      
      // Si la respuesta es exitosa (200-299)
      if (response.ok) {
        // Actualizar estado de favorito a true
        setIsFavorite(true);
        // Mostrar mensaje de éxito
        Swal.fire({
          title: '¡Éxito!',
          text: 'Añadido a favoritos',
          icon: 'success',
          confirmButtonColor: '#053f27ff',
          timer: 2000  
        });
      } 
      // Si el error es 401 (no autorizado)
      else if (response.status === 401) {
        Swal.fire({
          title: 'Error de autenticación',
          text: data.message || 'No autorizado',
          icon: 'error',
          confirmButtonColor: '#053f27ff'
        });
      } 
      // Si el error es 409 (conflicto - ya está en favoritos)
      else if (response.status === 409) {
        // Marcar como favorito aunque haya error de duplicado
        setIsFavorite(true);
        Swal.fire({
          title: 'Ya en favoritos',
          text: data.message || 'Esta ave ya está en favoritos',
          icon: 'info',
          confirmButtonColor: '#053f27ff',
          timer: 2000
        });
      } 
      // Para otros errores
      else {
        // Lanzar error con mensaje de la API o código de estado
        throw new Error(data.message || `Error ${response.status}`);
      }
    } catch (error) {
      // Mostrar error modal
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#053f27ff'
      });
    }
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="spinner-center">
        {/* Spinner de carga con tres puntos animados */}
        <ThreeDots height="80" width="80" radius="9" color="#4fa94d" visible={true} />
        <p className="loading-text">Cargando detalles del ave...</p>
      </div>
    );
  }

  // Si no hay datos del ave después de cargar, mostrar mensaje de error
  if (!bird) return <div className="error">Ave no encontrada</div>;

  // Función para convertir código de nivel de amenaza a texto descriptivo
  const getThreatLevelText = (code) => {
    // Objeto que mapea códigos a textos descriptivos
    const threatLevels = {
      'LC': 'LC - Preocupación menor', 
      'NT': 'NT - Casi amenazado',
      'VU': 'VU - Vulnerable', 
      'EN': 'EN - En peligro',
      'CR': 'CR - En peligro crítico'
    };
    // Retornar texto descriptivo o el código si no está en el mapeo
    return threatLevels[code] || code;
  };

  // Renderizar interfaz principal
  return (
    <section className="detalle-ave">
      {/* Enlace para volver a la lista de aves */}
      <Link to="/navarrevisca" className="back-link">← Volver a la lista</Link>
      
      {/* Contenedor principal de detalles */}
      <article className="detalle-container">
        {/* Sección de imagen */}
        <div className="detalle-imagen">
          {bird.imagen ? (
            // Mostrar imagen si existe
            <img src={bird.imagen} alt={bird.nombre_comun} />
          ) : (
            // Mostrar placeholder si no hay imagen
            <div className="no-image-placeholder">🦅</div>
          )}
        </div>
        
        {/* Sección de información */}
        <div className="detalle-info">
          {/* Nombre común del ave */}
          <h1>{bird.nombre_comun}</h1>
          
          {/* Nombre científico */}
          <p className="cientifico">
            <strong>Nombre científico:</strong> <em>{bird.nombre_cientifico}</em>
          </p>
          
          {/* Grid con información taxonómica */}
          <div className="detalle-grid">
            <div className="info-item"><strong>Orden:</strong> {bird.orden}</div>
            <div className="info-item"><strong>Familia:</strong> {bird.familia}</div>
            <div className="info-item">
              <strong>Nivel de amenaza:</strong>
              {/* Código de nivel de amenaza con clase CSS para color */}
              <span className={`threat-level threat-${bird.nivel_amenaza}`}>
                {bird.nivel_amenaza}
              </span>
              {/* Texto descriptivo del nivel de amenaza */}
              <span className="threat-text">{getThreatLevelText(bird.nivel_amenaza)}</span>
            </div>
          </div>
          
          {/* Sección de descripción completa */}
          <div className="descripcion">
            <h3>Descripción</h3>
            <p>{bird.descripcion_completa}</p>
          </div>
          
          {/* Sección de acciones (botón de favoritos) */}
          <div className="detalle-actions">
            {/* Mostrar botón diferente según si es favorito o no */}
            {!isFavorite ? (
              // Botón para añadir a favoritos (solo visible si no es favorito)
              <button onClick={handleAddToFavorites} className="btn btn-primary">
                ⭐ Añadir a favoritos
              </button>
            ) : (
              // Botón deshabilitado indicando que ya está en favoritos
              <button disabled className="btn btn-success">✅ En favoritos</button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

// Exportar el componente para poder usarlo en otros archivos
export default DetalleAveNavarrevisca;