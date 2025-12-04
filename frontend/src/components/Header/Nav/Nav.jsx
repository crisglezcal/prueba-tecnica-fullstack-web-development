import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Nav.css';

function Nav({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#053f27ff',
      cancelButtonColor: 'rgba(172, 123, 25, 1)',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Ejecutar la función de logout
        onLogout();
        
        // Mostrar confirmación
        Swal.fire({
          title: '¡Sesión cerrada!',
          text: 'Has salido correctamente',
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar',
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          // Redirigir a la página de login
          navigate('/login');
        });
      }
    });
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        
        {/* Home - siempre visible */}
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        
        {/* Sierra de Gredos - siempre visible */}
        <li>
          <NavLink to="/gredos" className={({ isActive }) => isActive ? 'active' : ''}>
            Sierra de Gredos
          </NavLink>
        </li>
        
        {/* Navarrevisca - siempre visible */}
        <li>
          <NavLink to="/navarrevisca" className={({ isActive }) => isActive ? 'active' : ''}>
            Navarrevisca
          </NavLink>
        </li>
        
        {/* Mis aves favoritas - solo visible si usuario está autenticado */}
        {isAuthenticated && (
          <li>
            <NavLink to="/favoritos" className={({ isActive }) => isActive ? 'active' : ''}>
              Mis aves favoritas
            </NavLink>
          </li>
        )}
        
        {/* Administrador - solo visible si usuario autenticado es admin */}
        {isAuthenticated && userRole === 'admin' && (
          <li>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>
              Administrador
            </NavLink>
          </li>
        )}
        
        {/* Autenticación - cambia entre Iniciar/Cerrar sesión */}
        <li className="auth-link">
          {isAuthenticated ? (
            // Botón para cerrar sesión con SweetAlert
            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          ) : (
            // Enlace para iniciar sesión
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
              Iniciar sesión
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Nav;