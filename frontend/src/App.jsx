import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './components/Main/Home/Home.jsx';
import Login from './components/Main/Login/Login.jsx';
import AvesGredos from './components/Main/AvesGredos/AvesGredos.jsx';
import AvesNavarrevisca from './components/Main/AvesNavarrevisca/AvesNavarrevisca.jsx';
import DetalleAveNavarrevisca from './components/Main/AvesNavarrevisca/DetalleAveNavarrevisca/DetalleAveNavarrevisca.jsx';
import Favoritos from './components/Main/Favoritos/Favoritos.jsx';
import Administrador from './components/Main/Administrador/Administrador.jsx';
import './App.css';

// Componente principal de la aplicación
function App() {

  // Estado para gestionar la autenticación y el rol del usuario
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para almacenar el rol del usuario (por defecto 'user')
  const [userRole, setUserRole] = useState('user');

  // VERIFICAR AUTENTICACIÓN AL CARGAR LA APLICACIÓN
  useEffect(() => {
    // Simulación de verificación de token (aquí se podría hacer una llamada real a una API)
    const token = localStorage.getItem('authToken');
    // Obtener el rol del usuario almacenado en localStorage
    const role = localStorage.getItem('userRole');
    
    // Si existe un token, el usuario está autenticado
    if (token) {
      // Actualizar el estado de autenticación y rol
      setIsAuthenticated(true);
      // Si no hay rol almacenado, se asume 'user' por defecto
      setUserRole(role || 'user');
    }
  }, []);

  // FUNCIÓN PARA MANEJAR EL INICIO DE SESIÓN
  const handleLogin = (token, role = 'user') => {
    // Almacenar el token y rol en localStorage
    localStorage.setItem('authToken', token);
    // Almacenar el rol del usuario
    localStorage.setItem('userRole', role);
    
    // Actualizar el estado de autenticación
    setIsAuthenticated(true);
    // Actualizar el rol del usuario
    setUserRole(role);
  };

  // FUNCIÓN PARA MANEJAR EL CIERRE DE SESIÓN
  const handleLogout = () => {
    // Eliminar el token y rol del localStorage
    localStorage.removeItem('authToken');
    // Eliminar el rol del usuario
    localStorage.removeItem('userRole');
    
    // Actualizar el estado de autenticación y rol
    setIsAuthenticated(false);
    setUserRole('user');
    
    // Redirigir al usuario a la página de inicio
    window.location.href = '/';
  };

  // RENDERIZADO DE LA APLICACIÓN CON RUTAS
  return (
    <Router>
      <div className="app">

        {/* Cabecera con navegación */}
        <Header 
          isAuthenticated={isAuthenticated} 
          userRole={userRole} 
          onLogout={handleLogout} 
        />
        
        {/* Contenido principal */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/gredos" element={<AvesGredos />} />
            <Route path="/navarrevisca" element={<AvesNavarrevisca />} />
            <Route path="/navarrevisca/detalle/:id" element={<DetalleAveNavarrevisca />} />
            
            {/* Rutas protegidas: favoritos y administrador */}
            <Route 
              path="/favoritos" 
              element={
                isAuthenticated ? 
                  <Favoritos /> : 
                  <Navigate to="/login" />
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                isAuthenticated && userRole === 'admin' ? 
                  <Administrador /> : 
                  <Navigate to="/" />
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;