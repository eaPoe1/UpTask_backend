import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const checkAuth = async(req, res, next) => {
    let token;
    const simple = req.headers.authorization;

    if( simple && simple.startsWith("Bearer")){
        try {
            token = simple.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.usuario = await Usuario.findById(decoded.id).select("-password -token -confirmado -createdAt -updatedAt -__v");
            
            return next();
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'});
        }
    }

    if(!token) {
        const error = new Error("Token no válido");
        return res.status(404).json({msg: error.message});
    }
    next();
}

export default checkAuth