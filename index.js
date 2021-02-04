const express = require('express');
const routes = require('./routes');
const path = require('path');
const { urlencoded } = require('express');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//Variables de entorno
require('dotenv').config({ path: 'variables.env' });

//Conexion a la DB
const db = require('./config/db');
//Importo modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
//Sincrinizar modelos con la DB
db.sync()
    .then(() => console.log('Conectado a la DB'))
    .catch((error) => console.log(error));

//Crear la app
const app = express();

//Cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar PUG
app.set('view engine', 'pug');

//Indicar las carpetas de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flas messages
app.use(flash());

app.use(cookieParser());

//Habilitar sesiones
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
}));

//Habilitar passport
app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la aplicacion
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    
    next();
})

//Leer los datos del req.body
app.use(express.urlencoded({ extended: false}));

//Manejo de rutas
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

//Escucha del servidor
app.listen(port, host, () => {
    console.log('Server corriendo.');
});
