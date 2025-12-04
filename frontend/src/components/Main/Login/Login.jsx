import React, { useState, useEffect } from 'react';
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si hay token de Google en la URL (para el callback)
  useEffect(() => {
    console.log('🔍 Verificando parámetros de URL...');
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const errorParam = urlParams.get('error');

    console.log('📋 Parámetros encontrados:', { token, errorParam });

    if (errorParam) {
      const errorMessage = `Error de Google: ${decodeURIComponent(errorParam)}`;
      console.error('❌ Error de Google:', errorMessage);
      setError(errorMessage);
      alert(errorMessage);
      
      // Limpiar URL después de mostrar el error
      window.history.replaceState({}, document.title, '/login');
    }

    if (token) {
      console.log('✅ Token de Google recibido en URL');
      handleGoogleCallback(token);
    }
  }, []);

  const handleGoogleCallback = async (token) => {
    try {
      console.log('🔄 Procesando callback de Google...');
      console.log('🔑 Token recibido:', token.substring(0, 50) + '...');
      
      // Guardar token en localStorage
      localStorage.setItem('token', token);
      console.log('💾 Token guardado en localStorage');
      
      // Decodificar el token para ver su contenido (sin verificar)
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = JSON.parse(atob(base64));
        console.log('📋 Token decodificado:', decoded);
      } catch (e) {
        console.log('⚠️ No se pudo decodificar token:', e.message);
      }
      
      // Obtener información del usuario desde el backend
      console.log('📡 Llamando a /api/auth/me con token...');
      const response = await fetch('http://localhost:3001/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('📥 Respuesta de /me:', {
        status: response.status,
        ok: response.ok
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('👤 Datos de usuario recibidos:', userData);
        
        // IMPORTANTE: Tu backend devuelve id_user, NO id o userId
        const userId = userData.id_user || userData.id || userData.userId;
        const userRole = userData.role || 'user';
        
        if (!userId) {
          throw new Error('No se recibió ID de usuario');
        }
        
        console.log('✅ Usuario autenticado:', { userId, role: userRole });
        
        // Llamar al callback de login
        onLogin(token, userRole, userId);
        
        // Limpiar URL después del login exitoso
        window.history.replaceState({}, document.title, '/');
        
        // Navegar a la página principal
        navigate('/');
      } else {
        const errorText = await response.text();
        console.error('❌ Error en respuesta de /me:', errorText);
        throw new Error(`Error del servidor: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error en callback de Google:', error);
      setError(error.message);
      alert(`Error en autenticación: ${error.message}`);
      
      // Limpiar URL en caso de error
      window.history.replaceState({}, document.title, '/login');
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError('');
    
    // IMPORTANTE: La URL debe coincidir con tu backend
    const googleAuthUrl = 'http://localhost:3001/api/auth/google';
    console.log('🌐 Redirigiendo a Google OAuth:', googleAuthUrl);
    
    // Redirigir a la página de autenticación de Google
    window.location.href = googleAuthUrl;
  };

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
        credentials: 'include'
      });
      
      const data = await response.json();
      console.log('📥 Respuesta del backend:', data);
      
      if (!response.ok) {
        throw new Error(data.msg || data.message || `Error ${response.status}`);
      }
      
      if (isLogin) {
        // Login exitoso
        console.log('✅ Login exitoso:', data);
        
        // Obtener token de headers o respuesta
        const token = data.token || 
                     response.headers.get('Authorization')?.replace('Bearer ', '') ||
                     data.access_token;
        
        if (token) {
          localStorage.setItem('token', token);
          
          // IMPORTANTE: Tu backend devuelve id_user, NO id
          const userId = data.id_user || data.id || data.userId;
          const userRole = data.role || 'user';
          
          if (!userId) {
            console.warn('⚠️ No se recibió ID de usuario, usando email como fallback');
          }
          
          onLogin(token, userRole, userId || formData.email);
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
          email: formData.email,
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
    setError('');
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
        
        {/* Botón de Google */}
        <div className="google-login-section">
          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <>
                <span className="spinner"></span> Conectando con Google...
              </>
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>
          
          <div className="separator">
            <span>o</span>
          </div>
        </div>
        
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
                  email: formData.email,
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
            {' | '}
            <a href="http://localhost:3001/api/auth/debug" target="_blank" rel="noreferrer">
              Auth Debug
            </a>
            {' | '}
            <a href="http://localhost:3001/api/auth/test-redirect" target="_blank" rel="noreferrer">
              Test Redirect
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;