const express = require('express')
const bodyParser = require('body-parser')
const propertiesExist = require ('../../src/middleware/properties-exist-middleware')

const app = express ()

app.use (bodyParser.urlencoded({
    extended: true
}))

app.post ('/', [
    propertiesExist ('body', [
        'firstName', 'lastName'
    ]),
    (req, res, next) => {
        return res.json(req.body)
    },
    (err, req, res, next) => {
        return res.status (400).send ({ message: err.message })
    }
])

module.exports = app