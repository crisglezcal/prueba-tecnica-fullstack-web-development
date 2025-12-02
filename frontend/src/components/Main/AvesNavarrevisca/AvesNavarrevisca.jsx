import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNavarreviscaBirds } from "../../../services/myApiService.js";
import './AvesNavarrevisca.css';

function AvesNavarrevisca() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Datos de ejemplo - luego conectarás la API real
    setTimeout(() => {
      setBirds([
        {
          id: 1,
          nombre_comun: 'Águila real',
          nombre_cientifico: 'Aquila chrysaetos',
          familia: 'Accipitridae',
          nivel_amenaza: 'LC',
          descripcion_corta: 'Rapaz de gran tamaño con plumaje marrón y dorado.',
          imagen: 'https://via.placeholder.com/400x300/3498db/ffffff?text=Águila+real'
        },
        {
          id: 2,
          nombre_comun: 'Buitre leonado',
          nombre_cientifico: 'Gyps fulvus',
          familia: 'Accipitridae',
          nivel_amenaza: 'LC',
          descripcion_corta: 'Ave carroñera de gran envergadura, común en montañas.',
          imagen: 'https://via.placeholder.com/400x300/2ecc71/ffffff?text=Buitre+leonado'
        },
        {
          id: 3,
          nombre_comun: 'Carbonero común',
          nombre_cientifico: 'Parus major',
          familia: 'Paridae',
          nivel_amenaza: 'LC',
          descripcion_corta: 'Pequeño pájaro de colores amarillo y verde con cresta.',
          imagen: 'https://via.placeholder.com/400x300/e74c3c/ffffff?text=Carbonero+común'
        },
        {
          id: 4,
          nombre_comun: 'Mirlo común',
          nombre_cientifico: 'Turdus merula',
          familia: 'Turdidae',
          nivel_amenaza: 'LC',
          descripcion_corta: 'Pájaro negro con pico amarillo, conocido por su canto.',
          imagen: 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Mirlo+común'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div className="loading">Cargando aves de Navarrevisca...</div>;
  }

  return (
    <div className="aves-navarrevisca">
      <div className="page-header">
        <h1>Aves de Navarrevisca 🟢</h1>
        <p className="subtitle">Base de datos local - Información detallada de especies</p>
      </div>

      <div className="birds-grid">
        {birds.map((bird) => (
          <Link 
            key={bird.id} 
            to={`/navarrevisca/detalle/${bird.id}`}
            className="bird-card"
          >
            <div className="bird-image">
              {bird.imagen ? (
                <img src={bird.imagen} alt={bird.nombre_comun} />
              ) : (
                <div className="no-image-placeholder">🦅</div>
              )}
            </div>
            
            <div className="bird-info">
              <h3>{bird.nombre_comun}</h3>
              <p className="scientific-name">{bird.nombre_cientifico}</p>
              
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
      </div>
    </div>
  );
}

export default AvesNavarrevisca;