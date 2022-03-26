import { Router } from "express";
import { 
    obtenerProyectos,
    obtenerProyecto,
    nuevoProyecto,
    editarProyecto,
    eliminarProyecto,
    agregaColaborador,
    eliminarColaborador,
    buscarColaborador, } from '../controllers/proyecto.js';
import checkAuth from "../middlewares/checkAuth.js";


const router = Router();

router.get('/', checkAuth, obtenerProyectos);
router.post('/', checkAuth, nuevoProyecto);

router.get('/:id', checkAuth, obtenerProyecto);
router.put('/:id', checkAuth, editarProyecto);
router.delete('/:id', checkAuth, eliminarProyecto);

router.post('/colaboradores', checkAuth, buscarColaborador);
router.post('/colaboradores/:id', checkAuth, agregaColaborador);
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador);

export default router;