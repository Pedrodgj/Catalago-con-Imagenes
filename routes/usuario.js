const {Router} = require('express');
const {check} = require('express-validator');

const { usuariosPost, usuarioDelete } = require('../controllers/usuario');

const { emailExiste, productoExistById } = require('../helpers/db_validator');

const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar_jwt');

const routes = Router();

routes.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('email').custom(emailExiste),
    check('password', 'La contraseña  debe de tener mas de 6 letras').isLength({min: 6}),
    validarCampos
],usuariosPost)

routes.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(productoExistById),
    validarCampos
],usuarioDelete)


module.exports = routes