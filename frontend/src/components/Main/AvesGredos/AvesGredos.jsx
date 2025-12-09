import React, { useState, useEffect } from 'react';
import './AvesGredos.css';

const VITE_API_URL = import.meta.VITE_API_URL


// Definir el componente funcional AvesGredos
function AvesGredos() {
  // Estado 1: Almacena la lista de observaciones de aves
  const [observations, setObservations] = useState([]);
  
  // Estado 2: Controla si se está cargando la información por primera vez
  const [loading, setLoading] = useState(true);
  
  // Estado 3: Almacena mensajes de error si ocurre algún problema
  const [error, setError] = useState('');
  
  // Estado 4: Almacena información adicional sobre los datos recibidos
  const [metadata, setMetadata] = useState(null);
  
  // Estado 5: Controla si se está actualizando manualmente los datos
  const [refreshing, setRefreshing] = useState(false);

  // Hook useEffect que se ejecuta una vez al montar el componente
  useEffect(() => {
    // Llamar a la función para cargar las observaciones
    loadObservations();
  }, []);

  // Función asíncrona para cargar observaciones desde la API
  const loadObservations = async () => {
    try {
      // Determinar qué estado de carga mostrar según el tipo de solicitud
      if (refreshing) {
        // Si es una actualización manual, usar estado refreshing
        setRefreshing(true);
      } else {
        // Si es carga inicial, usar estado loading
        setLoading(true);
      }
      
      // Limpiar cualquier error previo
      setError('');
      
      // Hacer petición HTTP GET al endpoint del backend
      const response = await fetch(`${VITE_API_URL}/api/avila/observations`);
      
      // Verificar si la respuesta HTTP no es exitosa (200-299)
      if (!response.ok) {
        // Lanzar error con código de estado HTTP
        throw new Error(`Error ${response.status}: No se pudieron cargar las observaciones`);
      }
      
      // Convertir la respuesta de la API a formato JSON
      const result = await response.json();
      
      // Mostrar los datos recibidos en consola para depuración
      console.log('Datos recibidos de la API:', result);
      
      // Procesar la respuesta según su estructura
      if (result.success) {
        // Si la API devuelve éxito, extraer datos y metadatos
        setObservations(result.datos || []); // Usar datos o array vacío
        setMetadata(result.metadata || {}); // Usar metadatos o objeto vacío
      } else {
        // Si no tiene estructura estándar, usar el resultado directamente
        setObservations(result || []);
      }
      
    } catch (err) {
      // Manejo de errores: registrar en consola y mostrar mensaje al usuario
      console.error('Error al cargar observaciones:', err);
      setError('Error al cargar las observaciones de Gredos. Por favor, intenta de nuevo más tarde.');
      
      // Usar datos de ejemplo como respaldo
      setObservations(getMockData());
    } finally {
      // Este bloque siempre se ejecuta, haya éxito o error
      setLoading(false); // Desactivar estado de carga
      setRefreshing(false); // Desactivar estado de actualización
    }
  };

  // Función para manejar clic en el botón "Actualizar observaciones"
  const handleRefreshClick = (e) => {
    // Prevenir comportamiento por defecto del navegador (ej: submit de formulario)
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Activar estado de actualización manual
    setRefreshing(true);
    
    // Ejecutar función para cargar nuevas observaciones
    loadObservations();
  };

  // Función para manejar clic en el botón "Reintentar" (cuando hay error)
  const handleRetryClick = (e) => {
    // Prevenir comportamiento por defecto
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Activar estado de carga
    setLoading(true);
    
    // Intentar cargar observaciones nuevamente
    loadObservations();
  };

  // Función para manejar clic en el botón "Actualizar datos" (cuando no hay datos)
  const handleUpdateDataClick = (e) => {
    // Prevenir comportamiento por defecto
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Activar estado de actualización manual
    setRefreshing(true);
    
    // Ejecutar función para cargar observaciones
    loadObservations();
  };

  // Función para extraer la ubicación de una observación
  const getLocation = (obs) => {
    // Prioridad 1: Campo estándar de eBird (locName)
    if (obs.locName) return obs.locName;
    
    // Prioridad 2: Campos personalizados en español (ubicacion)
    if (obs.ubicacion) return obs.ubicacion;
    
    // Prioridad 3: Campos personalizados en inglés (location)
    if (obs.location) return obs.location;
    
    // Valor por defecto si no hay ubicación
    return 'Ubicación no especificada';
  };

  // Función para extraer la fecha de una observación
  const getObservationDate = (obs) => {
    // Prioridad 1: Campo estándar de eBird (obsDt)
    if (obs.obsDt) return obs.obsDt;
    
    // Prioridad 2: Campos personalizados en español (fechaObservacion)
    if (obs.fechaObservacion) return obs.fechaObservacion;
    
    // Prioridad 3: Campos personalizados en inglés (observationDate)
    if (obs.observationDate) return obs.observationDate;
    
    // Valor por defecto si no hay fecha
    return 'Fecha no disponible';
  };

  // Función para extraer la cantidad de individuos observados
  const getQuantity = (obs) => {
    // Prioridad 1: Campo estándar de eBird (howMany)
    if (obs.howMany !== undefined) return obs.howMany;
    
    // Prioridad 2: Campos personalizados en español (cantidad)
    if (obs.cantidad !== undefined) return obs.cantidad;
    
    // Prioridad 3: Campos personalizados en inglés (count)
    if (obs.count !== undefined) return obs.count;
    
    // Valor por defecto si no hay cantidad
    return 'N/A';
  };

  // Función para extraer el nombre común del ave
  const getCommonName = (obs) => {
    // Prioridad 1: Campo estándar de eBird (comName - en inglés)
    if (obs.comName) return obs.comName;
    
    // Prioridad 2: Campos personalizados en español (especie)
    if (obs.especie) return obs.especie;
    
    // Prioridad 3: Campos personalizados en inglés (commonName)
    if (obs.commonName) return obs.commonName;
    
    // Valor por defecto si no hay nombre
    return 'Especie no identificada';
  };

  // Función para extraer el nombre científico del ave
  const getScientificName = (obs) => {
    // Prioridad 1: Campo estándar de eBird (sciName)
    if (obs.sciName) return obs.sciName;
    
    // Prioridad 2: Campos personalizados en español (nombreCientifico)
    if (obs.nombreCientifico) return obs.nombreCientifico;
    
    // Prioridad 3: Campos personalizados en inglés (scientificName)
    if (obs.scientificName) return obs.scientificName;
    
    // Valor por defecto si no hay nombre científico
    return '';
  };

  // Función para formatear fechas del formato eBird a español
  const formatEbirdDate = (dateString) => {
    // Si no hay fecha o es el valor por defecto, devolver mensaje
    if (!dateString || dateString === 'Fecha no disponible') return 'Fecha no disponible';
    
    try {
      // Separar fecha y hora (eBird usa: "YYYY-MM-DD HH:MM")
      const [datePart, timePart] = dateString.split(' ');
      
      // Separar año, mes y día
      const [year, month, day] = datePart.split('-');
      
      // Array con nombres de meses en español
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      
      // Formatear fecha en español: "día de mes de año"
      const formattedDate = `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
      
      // Si hay hora, añadirla al formato
      if (timePart) {
        return `${formattedDate} ${timePart}`;
      }
      
      // Devolver solo la fecha si no hay hora
      return formattedDate;
      
    } catch (error) {
      // Si hay error al formatear, registrar y devolver string original
      console.log('Error formateando fecha:', dateString, error);
      return dateString;
    }
  };

  // Función para limpiar nombres de ubicación (eliminar prefijos innecesarios)
  const cleanLocation = (location) => {
    // Si no hay ubicación o es el valor por defecto, devolver mensaje
    if (!location || location === 'Ubicación no especificada') {
      return 'Ubicación no especificada';
    }
    
    // Aplicar expresiones regulares para limpiar el texto
    let cleaned = location
      .replace(/^ES-CL-AV-/, '')  // Eliminar código de región eBird
      .replace(/^Ávila, /, '')    // Eliminar "Ávila, " al inicio
      .replace(/^Avila, /, '')    // Eliminar "Avila, " al inicio (sin acento)
      .replace(/\(.*?\)/g, '')    // Eliminar texto entre paréntesis
      .trim();                    // Eliminar espacios al inicio y final
    
    // Capitalizar primera letra si hay texto limpio
    if (cleaned) {
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    // Devolver ubicación original si no se pudo limpiar
    return location;
  };

  // Función que devuelve datos de ejemplo para desarrollo
  const getMockData = () => {
    return [
      {
        id: 1,
        especie: 'Carbonero común',
        nombreCientifico: 'Parus major',
        ubicacion: 'Parque Natural Sierra de Gredos',
        fechaObservacion: '2024-01-15 08:30',
        cantidad: 5,
        latitud: 40.2500,
        longitud: -5.2525,
        observador: 'Observador eBird'
      },
      {
        id: 2,
        especie: 'Mirlo común',
        nombreCientifico: 'Turdus merula',
        ubicacion: 'Laguna Grande de Gredos',
        fechaObservacion: '2024-01-14 15:45',
        cantidad: 3,
        latitud: 40.2550,
        longitud: -5.2450,
        observador: 'Observador eBird'
      }
    ];
  };

  // Renderizar estado de actualización manual (refreshing)
  if (refreshing) {
    return (
      <div className="page-header">
        <h1>Sierra de Gredos</h1>
      </div>
    );
  }

  // Renderizar estado de carga inicial (loading)
  if (loading) {
    return (
      <div className="page-header">
        <h1>Sierra de Gredos</h1>
      </div>

    );
  }

  // Renderizar estado de error (solo si no hay datos)
  if (error && observations.length === 0) {
    return (
      <div className="aves-gredos">
        <div className="page-header">
          <h1>Sierra de Gredos</h1>
        </div>
        <div className="error-message">
          <h3>Error al cargar datos</h3>
          <p>{error}</p>
          {/* Botón para reintentar cargar datos */}
          <button 
            onClick={handleRetryClick} 
            className="retry-btn"
            type="button" 
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Renderizar interfaz principal con datos
  return (
    <div className="aves-gredos">
      {/* Encabezado principal */}
      <div className="page-header">
        <h1>Sierra de Gredos</h1>
      </div>

      {/* Tarjeta informativa sobre los datos */}
      <div className="info-card">
        <h3>📡 Datos en Vivo</h3>
        <p>
          Esta sección muestra observaciones reales de aves en la Sierra de Gredos, 
          obtenidas de  <strong>eBird</strong>. Los datos se actualizan regularmente 
          con avistamientos reportados por observador@s.
        </p>
        {/* Mostrar metadatos si están disponibles */}
        {metadata && (
          <div className="metadata-info">
            <p><strong>Última actualización:</strong> {formatEbirdDate(metadata.timestamp)}</p>
            <p><strong>Total de observaciones:</strong> {observations.length}</p>
          </div>
        )}
      </div>

      {/* Grid de tarjetas con observaciones */}
      <div className="observations-grid">
        {/* Si no hay observaciones, mostrar mensaje */}
        {observations.length === 0 ? (
          <div className="no-data">
            <p>No hay observaciones recientes disponibles</p>
            {/* Botón para actualizar datos manualmente */}
            <button 
              onClick={handleUpdateDataClick} 
              className="refresh-btn"
              type="button" 
            >
              Actualizar datos
            </button>
          </div>
        ) : (
          // Mapear cada observación a una tarjeta
          observations.map((obs, index) => (
            <div key={obs.id || obs.subId || index} className="observation-card">
              {/* Encabezado de la tarjeta con nombre del ave */}
              <div className="observation-header">
                <h3>{getCommonName(obs)}</h3>
                <span className="scientific-name">
                  <em>{getScientificName(obs)}</em>
                </span>
              </div>

              {/* Detalles de la observación */}
              <div className="observation-details">
                <div className="detail">
                  <span className="label">📍 Ubicación:</span>
                  <span className="value">{cleanLocation(getLocation(obs))}</span>
                </div>
                
                <div className="detail">
                  <span className="label">📅 Fecha:</span>
                  <span className="value">{formatEbirdDate(getObservationDate(obs))}</span>
                </div>
                
                <div className="detail">
                  <span className="label">🔢 Cantidad:</span>
                  <span className="value count">
                    {getQuantity(obs)} {getQuantity(obs) !== 'N/A' ? 'individuos' : ''}
                  </span>
                </div>
                
                {/* Mostrar coordenadas solo si están disponibles */}
                {(obs.lat || obs.latitud || obs.latitude) && (obs.lng || obs.longitud || obs.longitude) && (
                  <div className="detail">
                    <span className="label">🌐 Coordenadas:</span>
                    <span className="value">
                      {(obs.lat || obs.latitud || obs.latitude).toFixed(4)}, 
                      {(obs.lng || obs.longitud || obs.longitude).toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Pie de la tarjeta con información de fuente */}
              <div className="observation-footer">
                <span className="source">Fuente: eBird</span>
                {(obs.observador || obs.observer) && (
                  <span className="observer">Observador: {obs.observador || obs.observer}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Controles principales */}
      <div className="controls">
        {/* Botón principal para actualizar todas las observaciones */}
        <button 
          onClick={handleRefreshClick} 
          className="btn-refresh"
          type="button" 
          disabled={refreshing} 
        >
          {refreshing ? 'Actualizando...' : 'Actualizar observaciones'}
        </button>
      </div>

      {/* Información sobre la API eBird */}
      <div className="api-info">
        <h3>ℹ️ Sobre eBird</h3>
        <p>
          eBird es una base de datos global de observaciones de aves en tiempo real. 
          Los datos se actualizan constantemente con contribuciones de observadores 
          de todo el mundo.
        </p>
        <p className="note">
          <strong>Nota:</strong> Los datos mostrados son reales y se actualizan periódicamente 
          desde los servidores de eBird.
        </p>
        {/* Enlace externo a eBird */}
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

// Exportar el componente para poder usarlo en otros archivos
export default AvesGredos;