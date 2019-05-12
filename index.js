const fileExtension = require ('./src/middleware/file-extension-middleware')
const propertiesExist = require ('./src/middleware/properties-exist-middleware')

module.exports = {
    fileExtension,
    propertiesExist
}