import React, { useState, useEffect } from 'react';
import { getNavarreviscaBirds } from "../../../services/myApiService.js";
import './Administrador.css';

function Administrador() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBird, setEditingBird] = useState(null);

  useEffect(() => {
    loadBirds();
  }, []);

  const loadBirds = async () => {
    try {
      const response = await getNavarreviscaBirds();
      setBirds(response.data || []);
    } catch (error) {
      console.error('Error cargando aves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (birdId) => {
    if (window.confirm('¿Estás seguro de eliminar este ave?')) {
      try {
        await deleteBird(birdId);
        setBirds(birds.filter(bird => bird.id !== birdId));
      } catch (error) {
        console.error('Error eliminando ave:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando panel de administración...</div>;
  }

  return (
    <div className="administrador">
      <h1>⚙️ Panel de Administrador</h1>
      <p className="subtitle">Gestión completa de la base de datos de aves</p>

      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nueva Ave'}
        </button>
      </div>

      <div className="birds-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre común</th>
              <th>Nombre científico</th>
              <th>Familia</th>
              <th>Nivel amenaza</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {birds.map((bird) => (
              <tr key={bird.id}>
                <td>{bird.id}</td>
                <td>{bird.nombre_comun}</td>
                <td>{bird.nombre_cientifico}</td>
                <td>{bird.familia}</td>
                <td>
                  <span className={`threat-level threat-${bird.nivel_amenaza}`}>
                    {bird.nivel_amenaza}
                  </span>
                </td>
                <td className="actions">
                  <button 
                    className="btn btn-small"
                    onClick={() => setEditingBird(bird)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(bird.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-info">
        <h3>ℹ️ Información del Panel</h3>
        <p>
          Como administrador, tienes acceso completo para gestionar la base de datos 
          de aves de Navarrevisca. Puedes crear nuevas especies, editar información 
          existente y eliminar registros cuando sea necesario.
        </p>
      </div>
    </div>
  );
}

export default Administrador;