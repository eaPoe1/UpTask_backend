import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import routerUsuario from './routes/usuarios.js';
import routerProyecto from './routes/proyecto.js';
import routerTarea from './routes/tarea.js';

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
dotenv.config();

connectDB();

//set cors

const whitelist = [process.env.FRONTEND_URL]; 

const corsOptions = {
    origin: function(origin, callback) {
        if(whitelist.includes(origin)){
            callback(null, true);
        } else {
            callback(new Error('Error de  Cors'));
        }
    }
}

app.use(cors(corsOptions));

//routes
app.use('/api/usuario', routerUsuario);
app.use('/api/proyecto', routerProyecto);
app.use('/api/tarea', routerTarea);

const servidor = app.listen(port, () => { console.log('Server on port', port) });

//socket.io

import { Server } from "socket.io";

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', socket => {
    console.log('Conectado a socket.io');
    
    socket.on('abrir proyecto', (proyecto) => {
        socket.join(proyecto);
    })

    socket.on('nueva tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea agregada", tarea)
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea eliminada", tarea)
    })

    socket.on('actualizar tarea', tarea => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', tarea => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('estado cambiado', tarea)
    })
})

