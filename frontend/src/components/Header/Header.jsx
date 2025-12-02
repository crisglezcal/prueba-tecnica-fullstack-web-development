import React from 'react';
import Nav from "./Nav/Nav.jsx";
import './Header.css';

function Header({ isAuthenticated, userRole, onLogout }) {
  return (
    <header className="header">
          <h1>Aves de Navarrevisca</h1>
          <p className="subtitle">Observación y conservación de avifauna</p>
        <Nav 
          isAuthenticated={isAuthenticated} 
          userRole={userRole} 
          onLogout={onLogout} 
        />
    </header>
  );
}

export default Header;