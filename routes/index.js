const express = require('express');
const router = express.Router();

//Importar el validador...
const { body } = require("express-validator");

//Importando el Controlador
const proyectosControllers = require('../controllers/proyectosControllers');
const tareasControllers = require('../controllers/tareasControllers');
const usuariosControllers = require('../controllers/usuariosControllers');
const authControllers = require('../controllers/authControllers');

module.exports = function () {
  //Creando las rutas...

  router.get('/',
    authControllers.usuarioAutenticado,
    proyectosControllers.protectosHome

  );

  router.get('/nuevo-proyecto',
    authControllers.usuarioAutenticado,
    proyectosControllers.formularioProyecto

  );
  router.post('/nuevo-proyecto',
    authControllers.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosControllers.nuevoProyecto
  );


  //Listar proyectos...
  router.get('/proyectos/:url',
    authControllers.usuarioAutenticado,
    proyectosControllers.proyectoPorUrl);

  //Actualizar el Proyecto
  router.get('/proyecto/editar/:id',
    authControllers.usuarioAutenticado,
    proyectosControllers.formularioEditar

  );
  router.post('/nuevo-proyecto/:id',
    authControllers.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosControllers.actualizarProyecto
  );

  //Eliminar Proyectos
  router.delete('/proyectos/:url',
    authControllers.usuarioAutenticado,
    proyectosControllers.eliminarProyecto
  );

  //Tareas

  router.post('/proyectos/:url',
    authControllers.usuarioAutenticado,
    tareasControllers.agregarTarea
  );

  //Agregando Tareas...

  router.patch('/tareas/:id',
    authControllers.usuarioAutenticado,
    tareasControllers.cambiarEstadoTarea

  );

  //Eliminando Tareas...

  router.delete('/tareas/:id',

    authControllers.usuarioAutenticado,
    tareasControllers.eliminarTarea

  );

  //Crear nueva cuenta

  router.get('/crear-cuenta', usuariosControllers.formCrearUsuario);
  router.post('/crear-cuenta', usuariosControllers.crearCuenta);
  router.get('/confirmar/:correo', usuariosControllers.confirmarCuenta)

  //Iniciar Sesion
  router.get('/iniciar-sesion', usuariosControllers.formIniciarSesion);
  router.post('/iniciar-sesion', authControllers.autenticarUsuario);

  //Cerrar Sesion

  router.get('/cerrar-sesion', authControllers.cerrarSesion);

  //Restablecer Contraseña

  router.get('/restablecer', usuariosControllers.formRestablecerPassword);
  router.post('/restablecer', authControllers.enviarToken);
  router.get('/restablecer/:token', authControllers.validarToken);
  router.post('/restablecer/:token', authControllers.actualizarPassword)
  return router;


}

