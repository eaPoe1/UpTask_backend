import Usuario from '../models/Usuario.js';
import { emailOlvidePassword, emailRegistro, generarId, generarJWT } from '../helpers/index.js';

export const getUsuario = (req, res) => {

    res.json({
        msg: 'get usuario'
    });
}

export const registrarUsuario = async(req, res) => {

    const { email } = req.body;

    const existeEmail = await Usuario.findOne({ email });
    if( existeEmail ){
        return res.status(401).json({
            msg: 'El email ya existe'
        });
    }


    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        await usuario.save();

        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        });
        res.json({msg: 'Usuario registrado correctamente, revisa tu email para confirmar tu cuenta'});
        
    } catch (error) {
        console.log(error);
    }
}

export const login = async(req, res) => {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    
    if(!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message });
    } 

    if(!usuario.confirmado) {
        const error = new Error("El Usuario no esta confirmado");
        return res.status(403).json({ msg: error.message });
    }

    if(await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    } else {
        const error = new Error("El password es incorrecto");
        return res.status(403).json({ msg: error.message });
    }

}

export const confirmar = async(req, res) => {
    const { token } = req.params;
    
    const usuario = await Usuario.findOne({token});
    if(!usuario){
        const error = new Error("Token no válido");
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuario.confirmado = true;
        usuario.token = '';
        await usuario.save();
        res.json({ msg: 'Usuario confirmado '});
    } catch (error) {
        console.log(error)
    }

}

export const olvidePassword = async(req, res) => {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });
    if(!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({ msg: error.message });
    } 

    try {
        usuario.token = generarId();
        await usuario.save();

        emailOlvidePassword({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        });

        res.json({ msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
    
}

export const comprobarToken = async(req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ token });
    if(usuario) {
        res.json({ msg: 'El usuario existe y se puede cambiar el password'});

    } else {
        const error = new Error("Token no válido");
        return res.status(404).json({ msg: error.message });
    }
}

export const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });
    if(usuario) {
        usuario.password = password;
        usuario.token = '';
        await usuario.save();
        res.json({ msg: 'password restablecida'});
    } else {
        const error = new Error("token incorrecto");
        return res.status(401).json({ msg: error.mesagge });
    }

} 

export const perfil = async(req, res) => {
    
    res.json(req.usuario);
}