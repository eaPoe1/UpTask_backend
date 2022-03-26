import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const generarId = () => {
    const a = Math.random().toString(32).substr(2); 
    const b = Date.now().toString(32);
    return a + b;
}

export const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

export const emailRegistro = async(datos) => {
    const { nombre, email, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Comprueba tu cuenta",
        text: "Comprueba tu cuenta en upTask",
        html: `<p>Hola: ${nombre}, Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        </p>
        <p>Si tu no creaste esta cuenta, desestima este mensaje.</p>
        `
    });
}

export const emailOlvidePassword = async(datos) => {
    const { nombre, email, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Recuperar password",
        text: "Recupera tu password",
        html: `<p>Hola: ${nombre}, Recupera tu password de UpTask</p>
        <p>Sigue el siguiente enlace para restablecer tu password: 
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
        </p>
        <p>Si tu esperabas este email, desestima este mensaje.</p>
        `
    });
}