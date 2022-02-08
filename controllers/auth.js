const { response } = require('express')
const bcryptjs = require('bcrypt')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar_jwt')

const usuarioLogin = async(req, res = response) => {
    
    const {email, password} = req.body
    
    try {
        
        //verificar si el email existe
        const usuario = await Usuario.findOne({email})
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            })
        }

        //si el usuario existe
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        }

        //vrificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //generar el jwt
        const token = await generarJWT(usuario.id)
        
        return res.json({
            mgs: 'usuarioLogin',
            email, password, token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}

module.exports = {
    usuarioLogin
}