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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [token, setToken] = useState(''); // ← AGREGAR ESTADO PARA TOKEN

  // VERIFICAR AUTENTICACIÓN AL CARGAR LA APLICACIÓN
  useEffect(() => {
    // Obtener token y rol del localStorage
    const storedToken = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (storedToken) {
      setIsAuthenticated(true);
      setUserRole(role || 'user');
      setToken(storedToken); // ← GUARDAR EL TOKEN EN EL ESTADO
    }
  }, []);

  // FUNCIÓN PARA MANEJAR EL INICIO DE SESIÓN
  const handleLogin = (token, role = 'user') => {
    // Almacenar el token y rol en localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    
    // Actualizar estados
    setIsAuthenticated(true);
    setUserRole(role);
    setToken(token); // ← GUARDAR TOKEN EN ESTADO
  };

  // FUNCIÓN PARA MANEJAR EL CIERRE DE SESIÓN
  const handleLogout = () => {
    // Eliminar datos del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    
    // Actualizar estados
    setIsAuthenticated(false);
    setUserRole('user');
    setToken(''); // ← LIMPIAR TOKEN DEL ESTADO
    
    // Redirigir al usuario a la página de inicio
    window.location.href = '/';
  };

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
            
            {/* Rutas protegidas */}
            <Route 
              path="/favoritos" 
              element={
                isAuthenticated ? 
                  <Favoritos /> : 
                  <Navigate to="/login" />
              } 
            />
            
            {/* RUTA ADMIN - PASAR TOKEN COMO PROP */}
            <Route 
              path="/admin" 
              element={
                isAuthenticated && userRole === 'admin' ? 
                  <Administrador 
                    isAuthenticated={isAuthenticated}
                    userRole={userRole}
                    token={localStorage.getItem('authToken')}
                  /> : 
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