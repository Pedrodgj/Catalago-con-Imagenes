const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const Usuario = require('../models/usuario')
const { vaciarUploads } = require('../helpers/eliminarImg_uploads')

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token) {

        return vaciarUploads(req, res, 401, 'No hay token en la petición. Por favor, ingresar usuario o crear un SuperUsuario')

    }

    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid)
        
        if(!usuario) {
            
            return vaciarUploads(req, res, 401, 'Token no valido - usuario no existe DB' )
            
        }
        
        if(!usuario.estado) {
            
            return vaciarUploads(req, res, 401, 'Token no valido - estado: false' )
        
        }

        next()

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: vaciarUploads(req, res, 'Token no valido')
        })
    }

}

module.exports = {
    validarJWT
}