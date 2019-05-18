const { MIDDLEWARE_PACKAGE_ERROR } = require ('./types')

/**
 * Represents an express middleware package error
 */
class MiddlewarePackageError extends Error {
    constructor (...params) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace (this, MiddlewarePackageError)
        }

        this.name = MIDDLEWARE_PACKAGE_ERROR
    }
}

module.exports = MiddlewarePackageError