const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const { htmlToText } = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

  // create reusable transporter object using the default SMTP transport
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
});

// Generar HTML
const generarHtml = (archivo, opciones = {}) => {
    const html = pug.renderFile(
        `${__dirname}/../views/emails/${archivo}.pug`,
        opciones,
    );
    return juice(html);
}

exports.enviar = async (opciones) => {
    const html = generarHtml(opciones.archivo, opciones);
    const text = htmlToText(html);
    
    // send mail with defined transport object
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html, 
    } 

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail);
}

