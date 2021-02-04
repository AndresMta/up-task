const express = require('express');
const router = express.Router();

//Importar express-validatos
const { body } = require('express-validator');

//Controlador
const proyectoControllers = require('../controllers/proyectoController');
const tareasControllers = require('../controllers/tareasController');
const usuariosControllers = require('../controllers/usuariosController')
const authController = require('../controllers/authController');

module.exports = function() {
    //Home
    router.get('/',
        authController.usuarioAutenticado,
        proyectoControllers.proyectosHome
    );
    
    //Formulario crear proyecto
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectoControllers.formularioProyecto
    );
    
    //Crear nuevo proyecto
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoControllers.nuevoProyecto
    );
    
    //Listar proyecto por url
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectoControllers.proyectoPorUrl
    );
    
    //Editar proyecto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectoControllers.formularioEditar
    );
    
    //Actualizar proyecto
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectoControllers.actualizarProyecto
    );

    //Eliminar proyectos
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectoControllers.eliminarProyecto
    );

    //Agregar Tarea
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasControllers.agregarTarea
    );

    //Cambiar estado tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasControllers.cambiarEstadoTarea
    );

    //Eliminar tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasControllers.eliminarTarea
    );

    //Formulario crear cuenta
    router.get('/crear-cuenta', usuariosControllers.formCrearCuenta);

    //Crear cuenta
    router.post('/crear-cuenta', usuariosControllers.crearCuenta);

    //Confrmar cuenta
    router.get('/confirmar/:correo', usuariosControllers.confirmarCuenta);

    //Formulario iniciar sesion
    router.get('/iniciar-sesion', usuariosControllers.formIniciarSesion);

    //Iniciar sesion
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar sesion
    router.get('/cerrar-sesion', 
        authController.usuarioAutenticado, 
        authController.cerrarSesion,
    );

    //formulario reestablecer password
    router.get('/reestablecer', usuariosControllers.formReestablecerPassword);

    //Reestablecer password
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;
}