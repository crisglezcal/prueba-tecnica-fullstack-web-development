import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Preparar endpoint y payload
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin 
      ? { 
          email: formData.email, 
          password: formData.password 
        }
      : { 
          email: formData.email, 
          password: formData.password,
          role: 'user',
          name: formData.name || '',
          surname: formData.surname || ''
        };
    
    console.log('🔄 Enviando a backend:', { endpoint, payload });
    
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include' // Para cookies JWT
      });
      
      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);
      
      if (!response.ok) {
        throw new Error(data.msg || `Error ${response.status}`);
      }
      
      if (isLogin) {
        // Login exitoso
        console.log('✅ Login exitoso:', data);
        
        // Obtener token de headers o respuesta
        const token = data.token || 
                     response.headers.get('Authorization')?.replace('Bearer ', '') ||
                     data.access_token;
        
        if (token) {
          localStorage.setItem('token', token); // Guardar en localStorage
          onLogin(token, data.role || 'user', data.id || data.userId);
          navigate('/');
        } else {
          throw new Error('No se recibió token de autenticación');
        }
        
      } else {
        // Registro exitoso
        console.log('✅ Registro exitoso:', data);
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión');
        
        // Cambiar a modo login
        setIsLogin(true);
        setFormData({
          email: formData.email, // Mantener el email
          password: '',
          name: '',
          surname: ''
        });
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      setError(error.message || 'Error en la conexión');
      alert(error.message || 'Error en la conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al cambiar campo
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Tu nombre"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="surname">Apellido</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Tu apellido"
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
            {!isLogin && (
              <small className="form-text">Mínimo 6 caracteres</small>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Procesando...
              </>
            ) : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button" 
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  email: formData.email, // Mantener email
                  password: '',
                  name: '',
                  surname: ''
                });
              }}
            >
              {isLogin ? ' Regístrate' : ' Inicia sesión'}
            </button>
          </p>
        </div>
        
        <div className="debug-info">
          <small>
            <strong>Debug:</strong> Backend en{' '}
            <a href="http://localhost:3001/api/status" target="_blank" rel="noreferrer">
              http://localhost:3001
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;