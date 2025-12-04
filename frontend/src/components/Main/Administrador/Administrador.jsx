import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ThreeDots } from 'react-loader-spinner';
import './Administrador.css';

function Administrador() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadBirds();
  }, []);

  const loadBirds = async () => {
    try {
      Swal.fire({
        title: 'Cargando aves...',
        text: 'Por favor, espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch('http://localhost:3001/aves/navarrevisca');
      
      if (!response.ok) {
        throw new Error('Error al cargar las aves');
      }

      const result = await response.json();
      const avesArray = result.data || [];
      
      Swal.close();
      
      if (avesArray.length === 0) {
        showMessage('info', 'Base de datos vacía', 'No se encontraron aves en la base de datos.');
      }

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
      
    } catch (error) {
      console.error('Error cargando aves:', error);
      Swal.close();
      showMessage('error', 'Error de conexión', 'No se pudo conectar con el servidor.');
      setBirds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (birdId, birdName) => {
    const result = await Swal.fire({
      title: '¿Eliminar ave?',
      text: `¿Estás seguro de eliminar "${birdName}"? Esta acción no se puede deshacer.`,
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
        
        const deleteResponse = await fetch(`http://localhost:3001/admin/aves/${birdId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          throw new Error(errorData.message || 'Error al eliminar el ave');
        }

        setBirds(birds.filter(bird => bird.id !== birdId));
        
        Swal.fire({
          title: '¡Eliminado!',
          text: `"${birdName}" ha sido eliminado correctamente.`,
          icon: 'success',
          confirmButtonColor: '#053f27ff',
          timer: 2000
        });
      } catch (error) {
        console.error('Error eliminando ave:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo eliminar el ave. Intenta nuevamente.',
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
        <input type="text" id="imagen" class="swal2-input" placeholder="URL de la imagen (ej: https://ejemplo.com/imagen.jpg)" required>
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

        // Validaciones frontend
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

          const createResponse = await fetch('http://localhost:3001/admin/aves', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(birdData)
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.message || 'Error al crear el ave');
          }

          await loadBirds();
          
          Swal.fire({
            title: '¡Creado!',
            text: `"${result.value.nombre_comun}" ha sido creado correctamente.`,
            icon: 'success',
            confirmButtonColor: '#053f27ff',
            timer: 2000
          });
        } catch (error) {
          console.error('Error creando ave:', error);
          Swal.fire({
            title: 'Error',
            text: error.message || 'No se pudo crear el ave. Intenta nuevamente.',
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
        <textarea id="descripcion_corta" class="swal2-textarea" placeholder="Descripción (mínimo 20 caracteres)">${bird.descripcion_corta}</textarea>
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

        // Validaciones frontend
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

          const updateResponse = await fetch(`http://localhost:3001/admin/aves/${bird.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(birdData)
          });

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(errorData.message || 'Error al actualizar el ave');
          }

          await loadBirds();
          
          Swal.fire({
            title: '¡Actualizado!',
            text: `"${result.value.nombre_comun}" ha sido actualizado correctamente.`,
            icon: 'success',
            confirmButtonColor: '#053f27ff',
            timer: 2000
          });
        } catch (error) {
          console.error('Error actualizando ave:', error);
          Swal.fire({
            title: 'Error',
            text: error.message || 'No se pudo actualizar el ave. Intenta nuevamente.',
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

  if (birds.length === 0 && !loading) {
    Swal.fire({
      title: 'No se encontraron aves',
      text: 'La base de datos está vacía. Puedes crear nuevas aves usando el botón "Nueva Ave".',
      icon: 'info',
      confirmButtonColor: '#053f27ff',
      confirmButtonText: 'Entendido'
    });
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
      </div>

      {birds.length > 0 && (
        <>
          <div className="birds-grid-admin">
            {birds.map((bird) => (
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

          <div className="admin-info">
            <h3>📊 Resumen de aves ({birds.length})</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <span className="summary-count">{birds.filter(b => b.nivel_amenaza === 'LC').length}</span>
                <span className="summary-label">LC - Preocupación menor</span>
              </div>
              <div className="summary-card">
                <span className="summary-count">{birds.filter(b => b.nivel_amenaza === 'NT').length}</span>
                <span className="summary-label">NT - Casi amenazado</span>
              </div>
              <div className="summary-card">
                <span className="summary-count">{birds.filter(b => b.nivel_amenaza === 'VU').length}</span>
                <span className="summary-label">VU - Vulnerable</span>
              </div>
              <div className="summary-card">
                <span className="summary-count">{birds.filter(b => b.nivel_amenaza === 'EN').length}</span>
                <span className="summary-label">EN - En peligro</span>
              </div>
              <div className="summary-card">
                <span className="summary-count">{birds.filter(b => b.nivel_amenaza === 'CR').length}</span>
                <span className="summary-label">CR - En peligro crítico</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Administrador;