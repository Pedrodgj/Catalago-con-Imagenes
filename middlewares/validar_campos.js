const { validationResult } = require("express-validator");
const fs = require('fs');

const validarCampos = (req, res, next) => {
    errors = validationResult(req);
    if(!errors.isEmpty()) {
        if(req.file === undefined) {
            return res.status(400).json(errors);
        } else if(req.file.path) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json(errors);
        }       
        //console.log(req.body);//(req.file.path)
    }

    next()
}


module.exports = {
    validarCampos
}