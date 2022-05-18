const { response, request } = require('express');

const Producto = require('../models/producto')

const productosGet = async(req, res = response) => {
    
    const productos = await Producto.find({estado: true})

    let productosAleatorios = productos.sort(() => {return Math.random() - 0.5});
    
    res.status(200).json({
        productosAleatorios
    })
}

const productosPost = async(req = request, res = response) => {
    
    const {nombre, imagen, descripcion, estado, tipo} = req.body;
    const producto = new Producto({nombre, imagen, descripcion, estado, tipo});
    
    await producto.save()
    
    res.status(200).json({
        producto        
    })
}

const productosPut = async(req = request, res = response) => {

    const {id} = req.params;
    const {_id, estado, imagen, public_id, ...resto} = req.body;

    const producto = await Producto.findByIdAndUpdate(id, resto, {new: true})

    res.json(producto)      
}

const productosDelete = async(req = request, res = response) => {
    
    const {id} = req.params;
    
    const producto = await Producto.findByIdAndUpdate(id, {estado: false})

    res.json(producto)
}

module.exports = {
    productosGet,
    productosPost,
    productosPut,
    productosDelete
}
