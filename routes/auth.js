const {Router} = require('express');
const {check} = require('express-validator');

const { usuarioLogin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar_campos');

const routes = Router();

routes.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
],usuarioLogin)


module.exports = routes