const {Router} = require('express')
const { check } = require('express-validator')

const { subirImagen, eliminarImagenCloud, actualizarImagenCloud } = require('../controllers/uploads')

const { productoExistById} = require('../helpers/db_validator')

const { validarCampos } = require('../middlewares/validar_campos')
const { validarArchivoSubir } = require('../middlewares/validar_imagen')

const routes = Router()

routes.post('/agregar/:id', [
    validarArchivoSubir,
    check('id', 'el id no es un id de mongo').isMongoId(),
    check('id').custom(productoExistById),
    validarCampos
], subirImagen);

routes.put('/cambiar/:id', [
    validarArchivoSubir,
    check('id', 'el id no es un id de mongo').isMongoId(),
    check('id').custom(productoExistById),
    validarCampos
], actualizarImagenCloud);

routes.delete('/eliminar/:id', [
    check('id', 'el id no es un id de mongo').isMongoId(),
    check('id').custom(productoExistById),
    validarCampos
], eliminarImagenCloud)


module.exports = routes