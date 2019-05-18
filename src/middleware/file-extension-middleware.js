const MiddlewareError = require ('../error/file-extension-middleware-error')

/**
 * Returns a middleware that calls next with an error when a file of _filesConfiguration_ is not using the correct extension
 * 
 * @param {{}} filesConfiguration An object with filenames as keys and array of string as value
 */
const fileExtensionMiddleware = filesConfiguration => {
    if (Array.isArray (filesConfiguration) || typeof filesConfiguration !== 'object') throw new TypeError ('_filesConfiguration_ must be an object') 

    const fileConfiguration = Object.entries (filesConfiguration)

    fileConfiguration.forEach (([, value]) => {
        if (!Array.isArray (value)) {
            throw new TypeError ('Each key of file configuration must be an array')
        }

        value.forEach (extension => {
            if (typeof extension !== 'string') {
                throw new TypeError ('Each item of each file of the configuration must be a string')
            }
        })
    })

    return (req, res, next) => {
        const invalidFilenames = fileConfiguration.reduce ((prev, [filename, extensions]) => {
            const file = req.files[filename]

            if (!file) {
                return prev
            }

            const { name } = file
            const regexResult = /\.(?<extension>.*$)/.exec (name)
            const { extension } = regexResult.groups
            
            if (!extensions.includes (extension)) {
                return [...prev, filename]
            }

            return prev
        }, [])

        if (invalidFilenames.length > 0) {
            return next (new MiddlewareError ({
                expected: filesConfiguration,
                received: invalidFilenames
            }, 'Invalid file extension'))
        }

        return next ()
    }
}

module.exports = fileExtensionMiddleware