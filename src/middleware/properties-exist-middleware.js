/**
 * Make a _propertiesExistMiddleware_. This middleware can be used to check if properties are defined in an property of the request object.
 * 
 * @param {String} propertyName Property name of the request object
 * @param {String[]} propertiesList Property names that you want to check
 */
const propertiesExistMiddleware = (propertyName, propertiesList) => {
    if (!propertyName) 
        throw new TypeError ('_propertyName_ must be defined')

    if (!(typeof propertyName === 'string')) 
        throw new TypeError ('_propertyName_ must be a String')

    if (!propertiesList)
        throw new TypeError ('_propertiesList_ must be defined')

    if (!Array.isArray(propertiesList))
        throw new TypeError ('_propertiesList_ must be an array')

    return (req, res, next) => {
        if (!(propertyName in req)) {
            throw new Error (`The property _${propertyName}_ specified by _propertyName_ in file-exists-middleware is not defined`)
        }

        if (Array.isArray(req[propertyName]) || typeof req[propertyName] !== 'object') {
            throw new Error (`The request property _${propertyName}_ specified by _propertyName_ must be an object`)
        }

        const keys = Object.keys (req[propertyName])

        const missing = ! (
            propertiesList.reduce ((prev, curr) => keys.includes (curr) && !!req[propertyName][curr] ? prev : false, true)
        )

        if (missing) {
            return next (new Error ('A property is missing'))
        }

        next ()
    }
}

module.exports = propertiesExistMiddleware
