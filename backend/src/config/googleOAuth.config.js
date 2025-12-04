/* 
🔏 AUTENTICACIÓN GOOGLE O AUTH - Configuración de Google OAuth 2.0
    * Usa Passport.js para la autenticación con Google
    * Configura la estrategia OAuth 2.0 con credenciales de Google
    * Maneja el flujo de autenticación y creación de usuarios
    * Exporta la configuración para usar en otros módulos
*/

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { signup, login } = require('../models/auth.model.js');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        let user = await getUserByEmail(email);

        if (!user) {
            user = await signup(email,'123ABCgoogle$', 'client');
        }

        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return done(null, { email: user.email, role: user.role, token });
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});