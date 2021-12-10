const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize  = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect:'/iniciar-sesion',
    failureFlash: true
});

//Funcion para revisar si el usuario esta autenticado..
exports.usuarioAutenticado = (req, res, next) => {

    //Si el usuario esta autenticado, adelante.
    if(req.isAuthenticated()){
        return next();
    }

    //Si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');

}

//Funcion para cerrar la sesion
exports.cerrarSesion= (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

//Genera un Token si el usuario es Valido...
exports.enviarToken = async (req, res) => {
    try {
           //Verificar que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where:{email}});

    //Si no existe el usiario
    if(!usuario){
        req.flash('error','No existe esa cuenta')
        res.redirect('/restablecer');
     }

     //Si el usuario Existe
     usuario.token = crypto.randomBytes(20).toString('hex');
     usuario.expiracion = Date.now() + 3600000;;

     //Guardar los datos en la base 
     await usuario.save();

     //Reset URL
     const resetURL = `http://${req.headers.host}/restablecer/${usuario.token}`;

     //Envia el correo con el TOKEN
     await enviarEmail.enviar({
         usuario,
         subject: 'Password Reset',
         resetURL,
         archivo: 'restablecer-password'
     });

     //Terminar.
     req.flash('correcto', 'Revisa tu casilla de correo.')
     res.redirect('/iniciar-sesion');

    } catch (error) {
        console.error(error)
    }
 
}

exports.validarToken = async (req, res ) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //Si no hay Usuario...
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer')
    }
    //Formulario para generar el Password
    res.render('resetPassword',{
        nombrePagina: 'Restablecer Password',

    })
}

//Cambia el password por uno Nuevo
exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion:{
                [Op.gte] : Date.now()
            }
        }
       
    });

    //Verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer')
    }

    //Hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion= null;

    //Guardamos el nuevo Password
    await usuario.save();

    req.flash('correcto','Password modificada');
    res.redirect('/iniciar-sesion');
}