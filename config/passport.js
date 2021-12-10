const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo que vamos a autenticar...
const Usuarios = require('../models/Usuarios');

//Local Strategy- Login con credenciales propios...(Usuario y Password)
passport.use(
    new LocalStrategy(
        //Por default passport espera un usuario y un password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where:{
                        email,
                        activo: 1
                    }
                });
                //El usuario existe pero el password es incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                // El usuario Existe 
                return done(null, usuario);
            } catch (error) {
                //Ese usuario NO existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )

);

//Serializar el Usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Deserializar el Usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Exportar

module.exports = passport; 