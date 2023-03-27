'use strict'

var Category = require('../models/categoria')


//routes
//app.use('/api', user_routes); //middleware para reescribir las routes /api/home /api/pruebas
//app.use('/api', peticion_routes); //middleware para reescribir las routes /api/home /api/pruebas
//app.use('/api', firma_routes); //middleware para reescribir las routes /api/home /api/pruebas

function home(req, res) {
    res.status(200).send({
        message : 'Hello World!'
    })
}

function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({
        message : 'Test action'
    })
}

//exportar la configuración
module.exports = {
    home,
    pruebas
};