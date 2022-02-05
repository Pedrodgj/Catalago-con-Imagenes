const express = require('express');
const path = require('path');

const cors = require('cors')
const multer = require('multer');
const {v4: uuidv4} = require('uuid')

const dbConnection = require('../db/config');

class Server {
    constructor() {
        //iniciando el servidor
        this.app = express();
        this.port = process.env.PORT;
        
        //llamar la base de datos
        this.conectarBd()

        //las rutas
        this.productosPath = '/api/productos';
        this.uploadsPath = '/api/uploads';

        //middlewares
        this.middlewares()

        //inicio de las rutas
        this.routes()

    }

    async conectarBd() {
        await dbConnection();
    }

    middlewares() {

        //cors
        this.app.use(cors())

        //lectura y parseo del body
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));

        //multer para subir las imagenes
        const storage = multer.diskStorage({
            destination: path.join(__dirname, '../uploads'),
            filename: (req, file, cb) => {
                cb(null, uuidv4() + path.extname(file.originalname))
            },
            /* fileFilter: (req, file, cb) => {
                const filetypes = /jpeg|jpg|png|gif/;
                const mimetype = filetypes.test(file.mimetype);
                const extname = filetypes.test(path.extname(file.originalname));
                if(mimetype && extname) {
                    return cb(null, true)
                }
                cb('Error: Archivo debe ser una imagen valida')
            } */
        })
        this.app.use(multer({storage}).single('imagen'))


        //directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.productosPath, require('../routes/productos'))
        this.app.use(this.uploadsPath, require('../routes/uploads'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor escuchando desde el puerto', this.port);
            console.log('Enviroment: ' + process.env.NODE_ENV);
        })
    }
}

module.exports = Server