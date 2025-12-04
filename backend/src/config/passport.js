// backend/src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

console.log('🔧 Configurando Passport para tabla Users (id_user)...');

// Estrategia de Google adaptada a TU esquema
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    console.log('🎯 Google Strategy para:', profile.emails[0].value);

    const email = profile.emails[0].value;
    const name = profile.displayName.split(' ')[0] || profile.displayName;
    const surname = profile.displayName.split(' ').slice(1).join(' ') || '';
    const googleId = profile.id;
    const avatar = profile.photos[0]?.value;

    // 1. Buscar usuario por email
    const userResult = await pool.query(
      'SELECT * FROM "Users" WHERE email = $1',
      [email]
    );

    let user = userResult.rows[0];

    if (!user) {
      // 2. Crear NUEVO usuario - Usando TU estructura exacta
      console.log('🆕 Creando nuevo usuario...');
      
      const insertQuery = `
        INSERT INTO "Users" 
        (name, surname, email, password, role, "googleId", avatar) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id_user, email, name, surname, role, "googleId", avatar
      `;
      
      const insertResult = await pool.query(insertQuery, [
        name,
        surname || '',
        email,
        'google-auth-' + googleId, // password dummy
        'user',
        googleId,
        avatar || ''
      ]);
      
      user = insertResult.rows[0];
      console.log('✅ Usuario creado - id_user:', user.id_user);
      
    } else {
      // 3. Usuario EXISTENTE - Actualizar googleId si está vacío
      console.log('✅ Usuario existente - id_user:', user.id_user);
      
      if (!user.googleId) {
        await pool.query(
          'UPDATE "Users" SET "googleId" = $1 WHERE id_user = $2',
          [googleId, user.id_user]
        );
        user.googleId = googleId;
        console.log('🔧 googleId actualizado');
      }
    }

    // 4. Generar JWT usando id_user (NO id)
    const token = jwt.sign(
      { 
        id_user: user.id_user,  // ← ¡IMPORTANTE! Usar id_user
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role || 'user',
        loginMethod: 'google'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Agregar token al objeto user
    user.token = token;
    console.log('🔑 Token JWT generado para:', user.email);
    
    return done(null, user);

  } catch (error) {
    console.error('💥 ERROR en Google Strategy:', error.message);
    console.error('Consulta SQL que falló:', error.query);
    return done(error, null);
  }
}));

// Serializar - Usar id_user (NO id)
passport.serializeUser((user, done) => {
  console.log('📦 Serializando id_user:', user.id_user);
  done(null, user.id_user);
});

// Deserializar - Buscar por id_user
passport.deserializeUser(async (id_user, done) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "Users" WHERE id_user = $1',
      [id_user]
    );
    
    const user = result.rows[0];
    if (!user) {
      console.error('❌ Usuario no encontrado con id_user:', id_user);
      return done(null, false);
    }
    
    console.log('📦 Deserializando usuario:', user.email);
    done(null, user);
  } catch (error) {
    console.error('❌ Error deserializando:', error);
    done(error, null);
  }
});

console.log('✅ Passport configurado para tabla con id_user');
module.exports = passport;