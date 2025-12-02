import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
          <h4>Contacto</h4>
          <p>Email: info@avesnavarrevisca.es</p>
          <p>Teléfono: 123 456 789</p>
        <p>&copy; {currentYear} Aves de Navarrevisca. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;