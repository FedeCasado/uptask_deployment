const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');


let trasport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
});

//Generar HTML
const generarHTLM = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones) =>{
    const html = generarHTLM(opciones.archivo, opciones);
    const text = htmlToText.fromString();
    let opcionesEmail = {
        from: '"UpTask" <no_replay@uptask.com>', 
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html 
      };
    
      const enviarEmail = util.promisify(trasport.sendMail, trasport)
      return enviarEmail.call(trasport, opcionesEmail)
 
}

