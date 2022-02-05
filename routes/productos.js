const {Router} = require('express');
const {check} = require('express-validator')

const { productosPost, productosGet, productosPut, productosDelete } = require('../controllers/productos');

const { tipoValido, nombreExiste, productoExistById } = require('../helpers/db_validator');

const { validarCampos } = require('../middlewares/validar_campos');

const routes = Router();

routes.get('/', productosGet)

routes.post('/agregarProducto', [
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombreExiste),
    check('descripcion', 'La Descripcion es obligatoria').not().isEmpty(),
    check('tipo').custom(tipoValido),
    validarCampos
], productosPost)

routes.put('/cambiarProducto/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(productoExistById),
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La Descripcion es obligatoria').not().isEmpty(),
    check('tipo').custom(tipoValido),
   validarCampos 
], productosPut)

routes.delete('/eliminarProducto/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(productoExistById),
    validarCampos
], productosDelete)


module.exports = routes