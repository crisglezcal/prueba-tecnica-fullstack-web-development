import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './Administrador.css';

function Administrador() {
  const [birds, setBirds] = useState([]);
  const [filteredBirds, setFilteredBirds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBirds();
  }, []);

  useEffect(() => {
    // Filtrar aves cuando cambia el término de búsqueda
    if (searchTerm.trim() === '') {
      setFilteredBirds(birds);
    } else {
      const filtered = birds.filter(bird =>
        bird.nombre_comun.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bird.nombre_cientifico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bird.familia.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBirds(filtered);
    }
  }, [searchTerm, birds]);

  const loadBirds = async () => {
    try {
      const response = await fetch('http://localhost:3001/aves/navarrevisca');
      
      if (!response.ok) {
        throw new Error('Error al cargar las aves');
      }

      const result = await response.json();
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
      
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar las aves',
        icon: 'error',
        confirmButtonColor: '#053f27ff'
      });
      setBirds([]);
      setFilteredBirds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (birdId, birdName) => {
    const result = await Swal.fire({
      title: '¿Eliminar ave?',
      text: `¿Estás seguro de eliminar "${birdName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('authToken');
        
        await fetch(`http://localhost:3001/admin/aves/${birdId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        await loadBirds();
        
        Swal.fire({
          title: 'Éxito',
          text: 'La lista se ha actualizado',
          icon: 'success',
          confirmButtonColor: '#053f27ff',
          timer: 2000
        });
        
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la acción',
          icon: 'error',
          confirmButtonColor: '#053f27ff'
        });
      }
    }
  };

  const handleCreate = () => {
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

        if (!imagen.startsWith('http')) {
          Swal.showValidationMessage('Debe proporcionar una URL válida para la imagen');
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
          
          const birdData = {
            common_name: result.value.nombre_comun,
            scientific_name: result.value.nombre_cientifico,
            order: "Passeriformes",
            family: result.value.familia,
            threat_level: result.value.nivel_amenaza,
            description: result.value.descripcion_corta,
            image: result.value.imagen
          };

          await fetch('http://localhost:3001/admin/aves', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(birdData)
          });

          await loadBirds();
          
          Swal.fire({
            title: 'Éxito',
            text: 'Ave creada correctamente',
            icon: 'success',
            confirmButtonColor: '#053f27ff',
            timer: 2000
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el ave',
            icon: 'error',
            confirmButtonColor: '#053f27ff'
          });
        }
      }
    });
  };

  const handleEdit = (bird) => {
    Swal.fire({
      title: 'Editar ave',
      html: `
        <input type="text" id="nombre_comun" class="swal2-input" placeholder="Nombre común" value="${bird.nombre_comun}">
        <input type="text" id="nombre_cientifico" class="swal2-input" placeholder="Nombre científico" value="${bird.nombre_cientifico}">
        <input type="text" id="familia" class="swal2-input" placeholder="Familia" value="${bird.familia}">
        <select id="nivel_amenaza" class="swal2-input">
          <option value="LC" ${bird.nivel_amenaza === 'LC' ? 'selected' : ''}>LC - Preocupación menor</option>
          <option value="NT" ${bird.nivel_amenaza === 'NT' ? 'selected' : ''}>NT - Casi amenazado</option>
          <option value="VU" ${bird.nivel_amenaza === 'VU' ? 'selected' : ''}>VU - Vulnerable</option>
          <option value="EN" ${bird.nivel_amenaza === 'EN' ? 'selected' : ''}>EN - En peligro</option>
          <option value="CR" ${bird.nivel_amenaza === 'CR' ? 'selected' : ''}>CR - En peligro crítico</option>
        </select>
        <textarea id="descripcion_corta" class="swal2-textarea" placeholder="Descripción">${bird.descripcion_corta}</textarea>
        <input type="text" id="imagen" class="swal2-input" placeholder="URL de la imagen" value="${bird.imagen || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
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

        if (!imagen.startsWith('http')) {
          Swal.showValidationMessage('Debe proporcionar una URL válida para la imagen');
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
          
          const birdData = {
            common_name: result.value.nombre_comun,
            scientific_name: result.value.nombre_cientifico,
            order: "Passeriformes",
            family: result.value.familia,
            threat_level: result.value.nivel_amenaza,
            description: result.value.descripcion_corta,
            image: result.value.imagen
          };

          await fetch(`http://localhost:3001/admin/aves/${bird.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(birdData)
          });

          await loadBirds();
          
          Swal.fire({
            title: 'Éxito',
            text: 'Ave actualizada correctamente',
            icon: 'success',
            confirmButtonColor: '#053f27ff',
            timer: 2000
          });
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el ave',
            icon: 'error',
            confirmButtonColor: '#053f27ff'
          });
        }
      }
    });
  };

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
    <div className="administrador">
      <div className="page-header">
        <h1>⚙️ Panel de Administrador</h1>
        <p className="subtitle">Gestión completa de la base de datos de aves</p>
      </div>

      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={handleCreate}
        >
          + Nueva Ave
        </button>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar por nombre, científico o familia..."
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
      </div>

      {filteredBirds.length > 0 ? (
        <>
          <div className="search-results-info">
            <p>
              Mostrando <strong>{filteredBirds.length}</strong> de <strong>{birds.length}</strong> aves
              {searchTerm && (
                <span> para "<em>{searchTerm}</em>"</span>
              )}
            </p>
          </div>

          <div className="birds-grid-admin">
            {filteredBirds.map((bird) => (
              <div key={bird.id} className="bird-card-admin">
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
                  
                  <div className="admin-buttons">
                    <button 
                      className="btn btn-small"
                      onClick={() => handleEdit(bird)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(bird.id, bird.nombre_comun)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : birds.length > 0 && searchTerm ? (
        <div className="no-results-message">
          <h3>No se encontraron resultados</h3>
          <p>No hay aves que coincidan con "<strong>{searchTerm}</strong>"</p>
          <button 
            className="btn btn-secondary"
            onClick={() => setSearchTerm('')}
          >
            Mostrar todas las aves
          </button>
        </div>
      ) : (
        <div className="no-birds-message">
          <h3>No hay aves en la base de datos</h3>
          <p>Usa el botón "Nueva Ave" para agregar la primera ave.</p>
        </div>
      )}
    </div>
  );
}

export default Administrador;