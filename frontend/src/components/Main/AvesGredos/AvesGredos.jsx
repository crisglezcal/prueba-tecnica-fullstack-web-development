import React, { useState, useEffect } from 'react';
import { getGredosObservations } from "../../../services/ebirdService.js";
import './AvesGredos.css';

function AvesGredos() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    try {
      setLoading(true);
      const response = await getGredosObservations();
      setObservations(response.data || []);
    } catch (err) {
      setError('Error al cargar las observaciones de Gredos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando observaciones de la Sierra de Gredos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="aves-gredos">
      <div className="page-header">
        <h1>Sierra de Gredos 🔵</h1>
        <p className="subtitle">Observaciones en tiempo real - Datos de la API eBird</p>
      </div>

      <div className="info-card">
        <h3>📡 Datos en Vivo</h3>
        <p>
          Esta sección muestra observaciones reales de aves en la Sierra de Gredos, 
          obtenidas de la API externa <strong>eBird</strong>. Los datos se actualizan regularmente 
          con avistamientos reportados por observadores.
        </p>
      </div>

      <div className="observations-grid">
        {observations.length === 0 ? (
          <div className="no-data">
            <p>No hay observaciones recientes disponibles.</p>
          </div>
        ) : (
          observations.map((obs) => (
            <div key={obs.id || obs.speciesCode} className="observation-card">
              <div className="observation-header">
                <h3>{obs.commonName || obs.common_name}</h3>
                <span className="scientific-name">
                  {obs.scientificName || obs.scientific_name}
                </span>
              </div>

              <div className="observation-details">
                <div className="detail">
                  <span className="label">📍 Ubicación:</span>
                  <span className="value">{obs.location || obs.locName}</span>
                </div>
                
                <div className="detail">
                  <span className="label">📅 Fecha:</span>
                  <span className="value">{obs.observationDate || obs.obsDt}</span>
                </div>
                
                <div className="detail">
                  <span className="label">🔢 Cantidad:</span>
                  <span className="value count">{obs.count || obs.howMany} individuos</span>
                </div>
                
                {obs.latitude && obs.longitude && (
                  <div className="detail">
                    <span className="label">🌐 Coordenadas:</span>
                    <span className="value">
                      {obs.latitude.toFixed(4)}, {obs.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              <div className="observation-footer">
                <span className="source">Fuente: eBird API</span>
                {obs.observer && (
                  <span className="observer">Observador: {obs.observer}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="api-info">
        <h3>ℹ️ Sobre la API eBird</h3>
        <p>
          eBird es una base de datos global de observaciones de aves en tiempo real. 
          Los datos se actualizan constantemente con contribuciones de observadores 
          de todo el mundo. Tu backend consume esta API y la procesa para mostrar 
          información relevante de la Sierra de Gredos.
        </p>
        <a 
          href="https://ebird.org/home" 
          target="_blank" 
          rel="noopener noreferrer"
          className="external-link"
        >
          Visitar eBird.org →
        </a>
      </div>
    </div>
  );
}

export default AvesGredos;