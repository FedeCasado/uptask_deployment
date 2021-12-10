const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearUsuario = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Inicia Sesion en UpTask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    // Leer los datos...
    const {email , password} = req.body;

    try {
    //Crear el Usuario

     await Usuarios.create({
        email, 
        password
    });

    //crear una URL de confirmar
    const confirmarURL = `http://${req.headers.host}/confirmar/${email}`;

    //Crear el objeto de usuario
    const usuario = {
        email
    }
    //Enviar Email
    await enviarEmail.enviar({
        usuario,
        subject: 'Confirma tu Cuenta Uptask',
        confirmarURL,
        archivo: 'confirmar-cuenta'
    });

    //Redirigir al Usuario
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
    res.redirect('/iniciar-sesion');
  
    } catch (error) {
        req.flash('error',error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password
        });
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer',{
        nombrePagina: 'Restablece tu contraseña'
    })
}

//Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    //Si no existe el usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada');
    res.redirect('/iniciar-sesion'); 
}