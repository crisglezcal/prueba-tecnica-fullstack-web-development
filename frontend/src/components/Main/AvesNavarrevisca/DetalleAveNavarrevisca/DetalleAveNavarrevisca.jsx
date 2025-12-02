import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBirdDetail, addToFavorites } from "../../../../services/myApiService.js";
import "../AvesNavarrevisca.css";

function DetalleAveNavarrevisca() {
  const { id } = useParams();
  const [bird, setBird] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simular carga de datos - luego conectarás la API real
    setTimeout(() => {
      setBird({
        id: parseInt(id),
        nombre_comun: 'Águila real',
        nombre_cientifico: 'Aquila chrysaetos',
        orden: 'Accipitriformes',
        familia: 'Accipitridae',
        descripcion_completa: 'El águila real es una de las aves rapaces más conocidas y emblemáticas. Es un ave de gran tamaño, con una envergadura que puede alcanzar los 2 metros. Se caracteriza por su plumaje marrón oscuro con tonos dorados en la cabeza y cuello.',
        imagen: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Águila+real',
        nivel_amenaza: 'LC',
        es_favorito: false
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToFavorites = () => {
    setIsFavorite(true);
    alert('¡Ave añadida a favoritos! (Simulación)');
  };

  if (loading) return <div className="loading">Cargando detalles del ave...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!bird) return <div className="error">Ave no encontrada</div>;

  return (
    <div className="detalle-ave">
      <Link to="/navarrevisca" className="back-link">
        ← Volver a la lista
      </Link>

      <div className="detalle-container">
        <div className="detalle-imagen">
          {bird.imagen ? (
            <img src={bird.imagen} alt={bird.nombre_comun} />
          ) : (
            <div className="no-image">🦅</div>
          )}
        </div>

        <div className="detalle-info">
          <h1>{bird.nombre_comun}</h1>
          <p className="cientifico">
            <strong>Nombre científico:</strong> {bird.nombre_cientifico}
          </p>
          
          <div className="detalle-grid">
            <div className="info-item">
              <strong>Orden:</strong> {bird.orden}
            </div>
            <div className="info-item">
              <strong>Familia:</strong> {bird.familia}
            </div>
            <div className="info-item">
              <strong>Nivel de amenaza:</strong> 
              <span className={`threat-level threat-${bird.nivel_amenaza}`}>
                {bird.nivel_amenaza}
              </span>
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
              <button disabled className="btn btn-success">
                ✅ En favoritos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleAveNavarrevisca;