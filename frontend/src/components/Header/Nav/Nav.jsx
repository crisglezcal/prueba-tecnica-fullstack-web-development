import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.css';

function Nav({ isAuthenticated, userRole, onLogout }) {
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
            // Botón para cerrar sesión (visible si está autenticado)
            <button onClick={onLogout} className="logout-btn">
              Cerrar sesión
            </button>
          ) : (
            // Enlace para iniciar sesión (visible si NO está autenticado)
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