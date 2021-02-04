const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//Local strategy. Login con credenciales propias (usuario y pass)
passport.use(
    new LocalStrategy(
        //Redefnimos los campos a autenticar
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1,
                    }
                });
                
                //El usuario existe, pero el pass es incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password incorrecto'
                    });
                }

                //El usuario existe y password correcto
                return done(null, usuario);
            } catch (error) {
                //El usuario no existe
                return done(null, false, {
                    message: 'El usuario no existe',
                });
            }
        }       
    )
);

//Serializar usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

//Deserializar usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;