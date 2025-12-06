import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Nav.css';

function Nav({ isAuthenticated, userRole, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

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
        onLogout();
        closeMenu();
        
        Swal.fire({
          title: '¡Sesión cerrada!',
          text: 'Has salido correctamente',
          icon: 'success',
          confirmButtonColor: 'rgba(172, 123, 25, 1)',
          confirmButtonText: 'Aceptar',
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          navigate('/login');
        });
      }
    });
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <nav className="navbar">
      {/* Botón Hamburguesa (solo visible en mobile/tablet) */}
      <button 
        className={`menu-toggle ${menuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-list ${menuOpen ? 'active' : ''}`}>
        
        {/* Home */}
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={handleLinkClick}
          >
            Home
          </NavLink>
        </li>
        
        {/* Sierra de Gredos */}
        <li>
          <NavLink 
            to="/gredos" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={handleLinkClick}
          >
            Sierra de Gredos
          </NavLink>
        </li>
        
        {/* Navarrevisca */}
        <li>
          <NavLink 
            to="/navarrevisca" 
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={handleLinkClick}
          >
            Navarrevisca
          </NavLink>
        </li>
        
        {/* Mis aves favoritas - solo visible si usuario está autenticado */}
        {isAuthenticated && (
          <li>
            <NavLink 
              to="/favoritos" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Mis aves favoritas
            </NavLink>
          </li>
        )}
        
        {/* Administrador - solo visible si usuario autenticado es admin */}
        {isAuthenticated && userRole === 'admin' && (
          <li>
            <NavLink 
              to="/admin" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Administrador
            </NavLink>
          </li>
        )}
        
        {/* Autenticación */}
        <li className="auth-link">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={handleLinkClick}
            >
              Iniciar sesión
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Nav;