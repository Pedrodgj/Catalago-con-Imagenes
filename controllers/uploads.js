const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const Producto = require('../models/producto')



const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']

const subirImagen = async(req, res) => {
    
    try {
        
        const archivo = req.file
        //console.log(archivo);
        
        const nombreCortado = archivo.path.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        
        if (!extensionesValidas.includes(extension)) {
            fs.unlinkSync(req.file.path)
            return res.json(`La extension ${extension} no esta permitida, las permitidas son ${extensionesValidas}`)
        }
        
        const {id} = req.params
        const producto = await Producto.findByIdAndUpdate(id);
        
        
        if(producto.imagen) {
            fs.unlinkSync(req.file.path)
            return res.status(400).json(`La Imagen ${producto.imagen} ya esta registrada en la Base de Datos`);
        }
        
        /* if(extensionesValidas.includes(extension)) {
            fs.unlinkSync(req.file.path)
        } */
        
        const {public_id, secure_url} = await cloudinary.uploader.upload(req.file.path);
        
        
        producto.public_id = public_id;
        producto.imagen = secure_url;
        
        fs.unlinkSync(req.file.path)
        
        await producto.save()
        
        res.json(producto)

    } catch (error) {
        console.log(error);
    }
}

const actualizarImagenCloud = async(req, res) => {

    try {
        
        const archivo = req.file
        //console.log(archivo);
        
        const nombreCortado = archivo.path.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        //fs.unlinkSync(archivo.path)
        
        if (!extensionesValidas.includes(extension)) {
            fs.unlinkSync(archivo.path)
            return res.json(`La extension ${extension} no esta permitida, las permitidas son ${extensionesValidas}`)
        }
        
        
        const {id} = req.params
        const producto = await Producto.findByIdAndUpdate(id);

        if(producto.imagen === '' && producto.estado) {
            fs.unlinkSync(req.file.path)
            return res.status(400).json(`El ${producto.nombre} no tiene imagen`);
        }

        if (producto.imagen && producto.estado) {
            cloudinary.uploader.destroy(producto.public_id)
        } else {
            fs.unlinkSync(req.file.path)
            return res.json(`El ${id} no esta registrado en la base de datos. Verificar el estado del producto`)
        }

        const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path);
        
        producto.public_id = public_id;
        producto.imagen = secure_url;
        
        fs.unlinkSync(req.file.path)
        
        await producto.save()
        
        res.json(producto)

    } catch (error) {
        console.log(error);
    }
}



const eliminarImagenCloud = async(req, res) => {
    
    try {
        const {id} = req.params
        const producto = await Producto.findByIdAndUpdate(id)
        
        const result = await cloudinary.uploader.destroy(producto.public_id)
        
        producto.imagen = '';
        await producto.save()
        
        
        res.json(result)
    
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    subirImagen,
    actualizarImagenCloud,
    eliminarImagenCloud
}