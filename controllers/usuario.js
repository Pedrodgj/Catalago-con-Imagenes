const Usuario = require('../models/usuario')
const bcryptjs = require('bcrypt')

const usuariosPost = async(req, res = response) => {

    const { nombre, email, password} = req.body;
    const usuario = new Usuario({nombre, email, password});


    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt)
    
    const yaExiste = await Usuario.find({estado:true})
    
    //console.log(yaExiste.length);

    if(yaExiste.length === 1) {
        return res.status(500).json({
            msg: `Ya existe un SuperUsuario. ${yaExiste}`
        })
    }
    
    //guardar en Db
    await usuario.save()

    res.json ({
        msg : 'hola desde post - controller',
        usuario
    });
}

const usuarioDelete = async(req = request, res = response) => {
    
    const {id} = req.params;
    
    const usuario = await Usuario.findByIdAndDelete(id, {estado: false})

    res.json(usuario)
}

module.exports = {
    usuariosPost,
    usuarioDelete
}