const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    imagen: {
        type: String,
        default: ''
    },

    public_id: {
        type: String
    },

    estado: {
        type: Boolean,
        default: true
    },

    descripcion: {
        type: String,
        required: true
    },

    tipo: {
        type: String,
        emun: ['TELEFONIA', 'COMPUTACION', 'ELECTRODOMESTICOS', 'ACCESORIOS']
    }
});

ProductoSchema.methods.toJSON = function() {
    const {__v, estado, public_id, ...producto} = this.toObject();
    return producto
}

module.exports = model('Producto', ProductoSchema)