const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');
const Op = Sequelize.Op;

//Autenticar usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'iniciar-sesion',
    failureFlash: true,
});

//Verificar si un usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //Si el usuario esta autentica se le permite seguir
    if(req.isAuthenticated()) {
        return next();
    }

    //Si no esta autetnticado se redigir a iniciar-sesion
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    if(!usuario) {
        req.flash('error', 'La cuenta no existe');
        res.redirect('/reestablecer');
    }

    //Si el usuario existe, le seteo el token y la expiracion
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;
    await usuario.save();

    //Url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`
    
    //Enviar la url por correo
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecerPassword',
    });

    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    //Obtener usuario
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
        }
    });

    //Si no existe usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //Si existe enviar formulario
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Password'
    })    
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();
    req.flash('correcto', 'Password modificado correctamente');
    res.redirect('/iniciar-sesion');
}