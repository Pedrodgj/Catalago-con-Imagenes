const fs = require('fs');

const vaciarUploads = ( req, res, status = 500, error = '', mensaje = '' ) => {

    if(req.file === undefined) {
        return res.status(status).json({
            msg: error + mensaje
        });
    } else if(req.file.path) {
        fs.unlinkSync(req.file.path);
        return res.status(status).json({
            msg: error + mensaje
        });
    } 
    
}

module.exports = {
    vaciarUploads
}