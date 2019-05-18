const PackageError = require ('./middleware-package-error')
const { PROPERTIES_EXIST_MIDDLEWARE_ERROR } = require ('./types')

/**
 * Represents an error produce by _PropertiesExistMiddlewareError_
 */
class PropertiesExistMiddlewareError extends PackageError {
    /**
     * Initialize a new instance of _PropertiesExistMiddlewareError_.
     * _propertiesNames_ must contains an _expectProperties_ key with an array and a _missingProperties_ key with an array.
     * 
     * @param {{}} propertiesNames An object with properties
     * @param  {...any} params 
     */
    constructor (propertiesNames, ...params) {
        super(...params)

        if (PackageError.captureStackTrace) PackageError.captureStackTrace (this, PropertiesExistMiddlewareError)

        this.propertiesNames = propertiesNames
        this.name = PROPERTIES_EXIST_MIDDLEWARE_ERROR
    }
}

module.exports = PropertiesExistMiddlewareError