import React from 'react';
import Nav from "./Nav/Nav.jsx";
import logo from '../../assets/logo.png'; // Sube dos niveles
import './Header.css';

function Header({ isAuthenticated, userRole, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo y título en fila */}
        <div className="header-logo-title">
          <img 
            src={logo} 
            alt="Logo Aves de Navarrevisca" 
            className="header-logo"
          />
          <div className="header-text">
            <h1>Aves de Navarrevisca</h1>
            <p className="subtitle">Observación y conservación de avifauna</p>
          </div>
        </div>
        
        <Nav 
          isAuthenticated={isAuthenticated} 
          userRole={userRole} 
          onLogout={onLogout} 
        />
      </div>
    </header>
  );
}

export default Header;