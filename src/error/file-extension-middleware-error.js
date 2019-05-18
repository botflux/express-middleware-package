const PackageError = require('./middleware-package-error')
const { FILE_EXTENSION_MIDDLEWARE_ERROR } = require ('./types')

/**
 * Represents an error produces by _fileExtesion_
 */
class FileExtensionMiddlewareError extends PackageError {
    
    /**
     * Initialize a new instance of _FileExtensionMiddlewareError_
     * 
     * @param {{}} files An object containing the expected files and invalid files
     * @param  {...any} params Normal _Error_ parameters
     */
    constructor (files, ...params) {
        super(...params)

        if (PackageError.captureStackTrace) {
            PackageError.captureStackTrace (this, FileExtensionMiddlewareError)
        }

        this.files = files
        this.name = FILE_EXTENSION_MIDDLEWARE_ERROR
    }
}

module.exports = FileExtensionMiddlewareError