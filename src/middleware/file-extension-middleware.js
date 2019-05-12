/**
 * Returns a middleware that calls next with an error when a file of _filesConfiguration_ is not using the correct extension
 * 
 * @param {{}} filesConfiguration An object with filenames as keys and array of string as value
 */
const fileExtensionMiddleware = filesConfiguration => {
    if (Array.isArray (filesConfiguration) || typeof filesConfiguration !== 'object') throw new Error ('_filesConfiguration_ must be an object') 

    const fileConfiguration = Object.entries (filesConfiguration)

    fileConfiguration.forEach (([, value]) => {
        if (!Array.isArray (value)) {
            throw new Error ('Each key of file configuration must be an array')
        }

        value.forEach (extension => {
            if (typeof extension !== 'string') {
                throw new Error ('Each item of each file of the configuration must be a string')
            }
        })
    })

    return (req, res, next) => {
        const fileIsValid = fileConfiguration.reduce ((prev, [filename, extensions]) => {
            const file = req.files[filename]

            if (!file) {
                return false
            }

            const { name } = file
            const regexResult = /\.(?<extension>.*$)/.exec (name)
            const { extension } = regexResult.groups
            
            if (!extensions.includes (extension)) {
                return false
            }

            return prev
        }, true)

        if (!fileIsValid) {
            return next (new Error ('Invalid file extension'))
        }

        return next ()
    }
}

module.exports = fileExtensionMiddleware