const express = require ('express')
const fileExtension = require ('../../src/middleware/file-extension-middleware')
const formidable = require ('express-formidable')

const app = express ()

/**
 * Form data parser
 */
app.use (formidable())

app.post ('/', [
    fileExtension ({ image: [ 'jpg' ], data: [ 'json' ] }),
    (req, res) => {
        return res.status(200).send ('Ok')
    },
    (err, req, res, next) => {
        return res.status (400).send ('Error')
    }
])

module.exports = app