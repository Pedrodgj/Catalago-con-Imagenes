const fs = require('fs');

const { vaciarUploads } = require('../helpers/eliminarImg_uploads');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const Producto = require('../models/producto')

const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif']

const subirImagen = async(req, res) => {
    
    try {
        
        const archivo = req.file

        const nombreCortado = archivo.path.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        
        if (!extensionesValidas.includes(extension)) {
            
            return vaciarUploads(req, res, 400, `La extension ${extension} no esta permitida, las permitidas son ${extensionesValidas}` )
            
        }
        
        const {id} = req.params
        const producto = await Producto.findByIdAndUpdate(id);

        if(!producto.estado) {
            
            return vaciarUploads(req, res, 400, 'No se encuentra el producto' )
            
        }
        
        
        if(producto.imagen) {
            
            return vaciarUploads(req, res, 400, `La Imagen ${producto.imagen} ya esta registrada en la Base de Datos` )
            
        }
        
        
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
        
        const nombreCortado = archivo.path.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        
        if (!extensionesValidas.includes(extension)) {
            
            return vaciarUploads(req, res, 400, `La extension ${extension} no esta permitida, las permitidas son ${extensionesValidas}` )

        }
        
        
        const {id} = req.params
        const producto = await Producto.findByIdAndUpdate(id);

        if(producto.imagen === '' && producto.estado) {
            
            return vaciarUploads(req, res, 400, `${producto.nombre} no tiene imagen`)
           
        }

        if (producto.imagen && producto.estado) {
            cloudinary.uploader.destroy(producto.public_id)
        } else {
            
            return vaciarUploads(req, res, 400, `El ${id} no esta registrado en la base de datos. Verificar el estado del producto`)
            
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
        
        if(!producto.estado) {
            return res.status(401).json({
                msg: 'El Producto no se encuentra en la base de datos. Verificar estado'
            })
        }

        const result = await cloudinary.uploader.destroy(producto.public_id)
        
        producto.imagen = '';
        producto.public_id = '';
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
