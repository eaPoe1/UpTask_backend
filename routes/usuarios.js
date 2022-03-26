import { Router } from "express";
import { 
        registrarUsuario, login,
        confirmar, olvidePassword, comprobarToken, nuevoPassword,
        perfil } 
from "../controllers/usuario.js";

import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

// router.get('/', getUsuario);
router.post('/', registrarUsuario);
router.post('/login', login);
router.get('/confirmar/:token', confirmar);
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);
router.get('/perfil', checkAuth, perfil)


export default router;