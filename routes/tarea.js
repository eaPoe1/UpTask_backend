import { Router } from 'express';
import { 
    obtenerTarea,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado } from '../controllers/tarea.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = Router();

router.post('/', checkAuth, crearTarea);

router.get('/:id', checkAuth, obtenerTarea);
router.put('/:id', checkAuth, actualizarTarea);
router.delete('/:id', checkAuth, eliminarTarea);

router.post('/estado/:id', checkAuth, cambiarEstado);

export default router;