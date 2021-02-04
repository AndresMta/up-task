const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta'
    });
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion',
        error,
    })
}

exports.crearCuenta = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        //Crear el usuario en la DB
        await Usuarios.create({ email, password });  

        //Crear la url de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario = {
            email,
        }

        //Enviar el email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar Cuenta',
            confirmarUrl,
            archivo: 'confirmarCuenta',
        });

        //Redireccionar
        req.flash('correcto', 'Te enviamos un correo. Confirma tu cuenta');
        res.redirect('/iniciar-sesion');    
    } catch (error) {
        req.flash('error', error.errors.map(err => err.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta',
        });
    }
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo,
        }
    });

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Su suenta ha sido activada');
    res.redirect('/iniciar-sesion');
}

exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer Password',
    })
}