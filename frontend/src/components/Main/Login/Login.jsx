import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import './Login.css';

// Componente Login que recibe la función onLogin como prop desde el componente padre (App.js)
function Login({ onLogin }) {
  
  // Estado 1 para controlar si estamos en modo login (true) o registro (false)
  const [isLogin, setIsLogin] = useState(true);
  
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    email: '',      // Email del usuario
    password: '',   // Contraseña del usuario
    name: '',       // Nombre (solo para registro)
    surname: ''     // Apellido (solo para registro)
  });
  
  // Estado 2 para controlar cuando se está procesando una solicitud (login o registro)
  const [loading, setLoading] = useState(false);
  
  // Estado 3 para almacenar mensajes de error
  const [error, setError] = useState('');
  
  // Hook de React Router para navegar entre páginas
  const navigate = useNavigate();

  // Función auxiliar para mostrar alertas de error con SweetAlert
  const showError = (title, message) => {
    Swal.fire({
      icon: 'error',           
      title: title,           
      text: message,          
      confirmButtonColor: 'rgba(172, 123, 25, 1)', 
      confirmButtonText: 'Entendido' 
    });
  };

  // Función auxiliar para mostrar alertas de éxito con SweetAlert
  const showSuccess = (title, message) => {
    Swal.fire({
      icon: 'success',           
      title: title,            
      text: message,           
      confirmButtonColor: '#053f27ff', 
      confirmButtonText: '¡Genial!'  
    });
  };

  // useEffect se ejecuta cuando el componente se monta y cuando cambian onLogin o navigate
  useEffect(() => {
    // Función interna para procesar el token de Google recibido en la URL
    const processGoogleCallback = async (token) => {
      try {
        // Guardar el token en localStorage para mantener la sesión
        localStorage.setItem('token', token);
        
        // Hacer una solicitud al backend para obtener los datos del usuario
        const response = await fetch('http://localhost:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` } 
        });

        // Si la respuesta es exitosa (status 200-299)
        if (response.ok) {
          // Convertir respuesta a JSON
          const userData = await response.json();
          
          // Extraer datos del usuario
          const userId = userData.id_user;      
          const userRole = userData.role || 'user'; // Rol del usuario (por defecto "user")
          
          // Validar que recibimos un ID de usuario
          if (!userId) throw new Error('No se recibió ID de usuario');
          
          // Llamar a la función onLogin del padre para actualizar el estado global
          onLogin(token, userRole, userId);
          
          // Limpiar la URL para quitar el token (por seguridad y estética)
          window.history.replaceState({}, document.title, '/');
          
          // Mostrar mensaje de éxito
          showSuccess('¡Bienvenid@!', 'Has iniciado sesión en tu perfil');
          
          // Redirigir a la página principal
          navigate('/');
        } else {
          // Si la respuesta del servidor no es exitosa
          throw new Error(`Error del servidor: ${response.status}`);
        }
      } catch (error) {
        // Manejar cualquier error durante el proceso
        setError(error.message); // Guardar error en estado
        showError('Error en autenticación', error.message); // Mostrar alerta
        window.history.replaceState({}, document.title, '/login'); // Limpiar URL
      }
    };

    // Leer los parámetros de la URL (ej: /login?token=abc123 o /login?error=message)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');      // Token de autenticación de Google
    const errorParam = urlParams.get('error'); // Error de autenticación de Google

    // Si hay un error en los parámetros (Google auth falló)
    if (errorParam) {
      const errorMsg = `Error de Google: ${decodeURIComponent(errorParam)}`;
      setError(errorMsg); // Guardar error en estado
      showError('Error de Google', errorMsg); // Mostrar alerta
      window.history.replaceState({}, document.title, '/login'); // Limpiar URL
    }

    // Si hay un token en los parámetros (Google auth exitosa)
    if (token) {
      processGoogleCallback(token); // Procesar el token
    }
  }, [onLogin, navigate]); // Dependencias: se ejecuta cuando onLogin o navigate cambian

  // Función para iniciar el login con Google
  const handleGoogleLogin = () => {
    // Redirigir al usuario al endpoint de Google OAuth en el backend
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  // Función para manejar el envío del formulario (login o registro normal)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);   
    setError('');       
    
    // Determinar endpoint y payload según el modo (login o registro)
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const payload = isLogin 
      ? { 
          email: formData.email, 
          password: formData.password 
        } // Para login: solo email y password
      : { 
          email: formData.email, 
          password: formData.password,
          role: 'user', // Nuevos usuarios siempre son 'user' (no admin)
          name: formData.name,
          surname: formData.surname 
        }; // Para registro: todos los campos
    
    try {
      // Enviar solicitud al backend
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      // Convertir respuesta a JSON
      const data = await response.json();
      
      // Si la respuesta no es exitosa (status 400-599)
      if (!response.ok) {
        throw new Error(data.msg || data.message || `Error ${response.status}`);
      }
      
      // Si es login exitoso
      if (isLogin) {
        const token = data.token; // Token JWT del backend
        if (token) {
          localStorage.setItem('token', token); // Guardar token en localStorage
          const userId = data.id_user;         // ID del usuario
          const userRole = data.role || 'user'; // Rol del usuario
          
          // Actualizar estado global de la aplicación
          onLogin(token, userRole, userId);
          
          // Mostrar mensaje de éxito
          showSuccess('¡Bienvenido!', 'Inicio de sesión exitoso');
          
          // Redirigir a página principal
          navigate('/');
        } else {
          throw new Error('No se recibió token');
        }
      } else {
        // Si es registro exitoso
        showSuccess('¡Cuenta creada!', 'Ahora puedes iniciar sesión');
        
        // Cambiar a modo login
        setIsLogin(true);
        
        // Limpiar formulario (mantener email, limpiar los demás campos)
        setFormData({ 
          email: formData.email, 
          password: '', 
          name: '', 
          surname: '' 
        });
      }
      
    } catch (error) {
      // Manejar errores de la solicitud
      setError(error.message); // Guardar error en estado
      showError('Error', error.message); // Mostrar alerta
    } finally {
      setLoading(false); // Desactivar estado de carga (se ejecuta siempre)
    }
  };

  // Función para manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    // Actualizar solo el campo que cambió
    setFormData({ 
      ...formData,          // Mantener los otros campos
      [e.target.name]: e.target.value // Actualizar el campo modificado
    });
    setError(''); // Limpiar errores al escribir
  };

  // Función para alternar entre modo login y registro
  const toggleMode = () => {
    setIsLogin(!isLogin); // Cambiar el modo
    setError(''); // Limpiar errores
    
    // Limpiar formulario (mantener email si ya estaba escrito)
    setFormData({ 
      email: formData.email, 
      password: '', 
      name: '', 
      surname: '' 
    });
  };

  // Renderizado del componente
  return (
    <section className="login-container">
      <article className="login-card">
        {/* Título que cambia según el modo */}
        <h2>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
        
        {/* Mostrar error si existe */}
        {error && <div className="error-message">❌ {error}</div>}
        
        {/* Sección de login con Google */}
        <div className="google-login-section">
          <button 
            type="button" 
            className="btn-google" 
            onClick={handleGoogleLogin}
          >
            Continuar con Google
          </button>
          
          {/* Separador visual */}
          <div className="separator">
            <span>o</span>
          </div>
        </div>
        
        {/* Formulario principal */}
        <form onSubmit={handleSubmit}>
          {/* Campos de nombre y apellido solo en modo registro */}
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin} // Requerido solo en registro
                  placeholder="Nombre"
                />
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required={!isLogin} // Requerido solo en registro
                  placeholder="Apellido"
                />
              </div>
            </>
          )}
          
          {/* Campo email con Regex (siempre visible) */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Por favor, ingresa un email válido. Ejemplo: usuario@dominio.com"
              onInvalid={(e) => {
                e.target.setCustomValidity('Ingresa un email válido como: nombre@ejemplo.com');
              }}
              onInput={(e) => {
                e.target.setCustomValidity('');
              }}
            />
          </div>
          
          {/* Campo contraseña con Regex (siempre visible) */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Contraseña"
              minLength="6"
              pattern="^(?=.*[A-Za-zÑñ])(?=.*\d)(?=.*[^\s\w]).{6,}$"
              title="Mínimo 6 caracteres: debe incluir letra (puede ser ñ), número y algún símbolo especial"
              onInvalid={(e) => {
                e.target.setCustomValidity('Debe tener 6+ caracteres con al menos: 1 letra, 1 número, 1 símbolo (ej: @#$_!*)');
              }}
              onInput={(e) => {
                e.target.setCustomValidity('');
              }}
            />
          </div>
          
          {/* Botón de envío del formulario */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            // Deshabilitar si está cargando o faltan campos obligatorios
            disabled={loading || !formData.email || !formData.password}
          >
            {/* Texto del botón cambia según estado */}
            {loading ? 'Procesando...' : isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>
        
        {/* Pie de página para alternar entre login y registro */}
        <div className="login-footer">
          <p>
            {/* Mensaje que cambia según el modo */}
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              type="button" 
              className="switch-btn" 
              onClick={toggleMode}
            >
              {/* Texto del botón cambia según el modo */}
              {isLogin ? ' Regístrate' : ' Inicia sesión'}
            </button>
          </p>
        </div>
      </article>
    </section>
  );
}

export default Login; // Exportar el componente para uso en otras partes de la aplicación