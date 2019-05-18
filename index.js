const fileExtension = require ('./src/middleware/file-extension-middleware')
const propertiesExist = require ('./src/middleware/properties-exist-middleware')

module.exports = {
    fileExtension,
    propertiesExist,
    errors: {
        fileExtensionError: require('./src/error/file-extension-middleware-error'),
        middlewarePackageError: require('./src/error/middleware-package-error'),
        propertiesExistError: require('./src/error/properties-exist-middleware-error'),
        types: require('./src/error/types')
    }
}