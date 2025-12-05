import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import "../AvesNavarrevisca.css";

function DetalleAveNavarrevisca() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bird, setBird] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar detalles del ave
  useEffect(() => {
    const fetchBirdDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/aves/navarrevisca/detalle/${id}`);
        
        if (!response.ok) throw new Error(`Error ${response.status}`);
        
        const result = await response.json();
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
          setIsFavorite(result.data.es_favorito || false);
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonColor: '#053f27ff'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBirdDetail();
  }, [id]);

  // Función para añadir a favoritos - VERSIÓN CORREGIDA
  const handleAddToFavorites = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        Swal.fire({
          title: 'No autenticado',
          text: 'Debes iniciar sesión para añadir a favoritos',
          icon: 'warning',
          confirmButtonColor: '#053f27ff',
          confirmButtonText: 'Ir a login'
        }).then(() => navigate('/login'));
        return;
      }

      console.log('🔑 Token:', token.substring(0, 30) + '...');
      console.log('📤 Enviando a:', `http://localhost:3001/aves/navarrevisca/detalle/${id}/favoritos`);
      
      const response = await fetch(`http://localhost:3001/aves/navarrevisca/detalle/${id}/favoritos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Status:', response.status);
      const data = await response.json();
      console.log('📥 Respuesta:', data);
      
      if (response.ok) {
        setIsFavorite(true);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Añadido a favoritos',
          icon: 'success',
          confirmButtonColor: '#053f27ff',
          timer: 2000
        });
      } else if (response.status === 401) {
        Swal.fire({
          title: 'Error de autenticación',
          text: data.message || 'No autorizado',
          icon: 'error',
          confirmButtonColor: '#053f27ff'
        });
      } else if (response.status === 409) {
        setIsFavorite(true);
        Swal.fire({
          title: 'Ya en favoritos',
          text: data.message || 'Esta ave ya está en favoritos',
          icon: 'info',
          confirmButtonColor: '#053f27ff',
          timer: 2000
        });
      } else {
        throw new Error(data.message || `Error ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#053f27ff'
      });
    }
  };

  if (loading) {
    return (
      <div className="spinner-center">
        <ThreeDots height="80" width="80" radius="9" color="#4fa94d" visible={true} />
        <p className="loading-text">Cargando detalles del ave...</p>
      </div>
    );
  }

  if (!bird) return <div className="error">Ave no encontrada</div>;

  const getThreatLevelText = (code) => {
    const threatLevels = {
      'LC': 'LC - Preocupación menor', 'NT': 'NT - Casi amenazado',
      'VU': 'VU - Vulnerable', 'EN': 'EN - En peligro',
      'CR': 'CR - En peligro crítico'
    };
    return threatLevels[code] || code;
  };

  return (
    <div className="detalle-ave">
      <Link to="/navarrevisca" className="back-link">← Volver a la lista</Link>
      
      <div className="detalle-container">
        <div className="detalle-imagen">
          {bird.imagen ? (
            <img src={bird.imagen} alt={bird.nombre_comun} />
          ) : (
            <div className="no-image-placeholder">🦅</div>
          )}
        </div>
        
        <div className="detalle-info">
          <h1>{bird.nombre_comun}</h1>
          <p className="cientifico">
            <strong>Nombre científico:</strong> <em>{bird.nombre_cientifico}</em>
          </p>
          
          <div className="detalle-grid">
            <div className="info-item"><strong>Orden:</strong> {bird.orden}</div>
            <div className="info-item"><strong>Familia:</strong> {bird.familia}</div>
            <div className="info-item">
              <strong>Nivel de amenaza:</strong>
              <span className={`threat-level threat-${bird.nivel_amenaza}`}>
                {bird.nivel_amenaza}
              </span>
              <span className="threat-text">{getThreatLevelText(bird.nivel_amenaza)}</span>
            </div>
          </div>
          
          <div className="descripcion">
            <h3>Descripción</h3>
            <p>{bird.descripcion_completa}</p>
          </div>
          
          <div className="detalle-actions">
            {!isFavorite ? (
              <button onClick={handleAddToFavorites} className="btn btn-primary">
                ⭐ Añadir a favoritos
              </button>
            ) : (
              <button disabled className="btn btn-success">✅ En favoritos</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleAveNavarrevisca;