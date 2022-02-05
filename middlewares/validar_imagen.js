
const validarArchivoSubir = (req, res, next) => {
    if (!req.file || Object.keys(req.file).length === 0 || !req.file.mimetype) {
        return res.status(400).json(
            {msg: 'No se ha subido ningun archivo'
        });
    }

    next()
}

module.exports = {
    validarArchivoSubir
}