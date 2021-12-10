const express = require('express');
const routes = require('./routes/index');
const path = require('path'); // PAth es una lubreria que existe en NODE. Path lo que hace es leer los archivos que existen en la carpeta
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport')

//Importar las Variables del entorno
require('dotenv').config({path:'variables.env'});

//Importando los Helpers con algunas funciones...
const helpers = require('./helpers');

//Crear la conexion a la base de datos...
const db = require('./config/db');

//importar el modelo
require('./models/Proyecto');
require('./models/Tareas');
require('./models/Usuarios')

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error))

// Crear una APP de Express...
const app = express();

//Donde cargar los archivos estaticos...
app.use(express.static('public'))

//Habilitar PUG...
app.set('view engine', 'pug' );

//Habilitar BodyParser para leer los datos del formulario...
app.use(bodyParser.urlencoded({extend: true }));



//Añadir la carpeta de las vistas....Para poderle decir a express que queremos leer esta carpeta, debemos requerir el PATH..

app.set('views', path.join(__dirname, './views') )

//Agregar Flash mensajes
app.use(flash());

app.use(cookieParser());

//Sessiones nos permite navegar entre distintas paginas sin necesidad de volvernos a autenticar...
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicacion

app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes= req.flash();
    res.locals.usuario = {...req.user} || null;
    
    next();
});


app.use('/', routes() );

//Servidor y Puerto

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El Servidor esta funcionando')
});