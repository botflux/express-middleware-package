const middlewareFactory = require ('../../src/middleware/file-extension-middleware')

describe ('#fileExtensionMiddleware', () => {
    it ('throws an error when the configuration is not an object', () => {
        expect (() => middlewareFactory ([])).toThrow (Error)
        expect (() => middlewareFactory ([])).toThrow ('_filesConfiguration_ must be an object')
        
        expect (() => middlewareFactory({})).not.toThrow (Error)

        const configurationWithObject = { file: {} }

        expect (() => middlewareFactory (configurationWithObject)).toThrow (Error)
        expect (() => middlewareFactory (configurationWithObject)).toThrow ('Each key of file configuration must be an array')

        const configurationWithArray = { file: [] }

        expect (() => middlewareFactory (configurationWithArray)).not.toThrow (Error)

        const configurationWithArrayOfObjects = { file: [{ }] }
        expect (() => middlewareFactory (configurationWithArrayOfObjects)).toThrow (Error)
        expect (() => middlewareFactory (configurationWithArrayOfObjects)).toThrow ('Each item of each file of the configuration must be a string')

        const configurationWithArrayOfStrings = { file: [ 'jpg', 'png' ] }
        expect (() => middlewareFactory (configurationWithArrayOfStrings)).not.toThrow (Error)
    })

    it ('calls next when every specified files use the right extension', () => {
        const middleware = middlewareFactory ({
            csvDocument: [ 'csv' ],
            jsonFile: [ 'json' ],
            image: [ 'png', 'jpg', 'jpeg', 'webp' ]
        })

        const next = jest.fn (() => {})
        const req = {
            files: {
                csvDocument: {
                    name: 'myData.csv'
                },
                jsonFile: {
                    name: 'users.json'
                },
                image: {
                    name: 'doggo.jpeg'
                }
            }
        }

        middleware (req, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next.mock.calls[0][0]).toBe (undefined)
    })

    it ('calls next with an error when of the file is not using the right extension', () => {
        const middleware = middlewareFactory ({
            csvDocument: [ 'csv' ],
            jsonFile: [ 'json' ],
            image: [ 'png', 'jpg', 'jpeg', 'webp' ]
        })

        const next = jest.fn (() => {})
        const req = {
            files: {
                csvDocument: {
                    name: 'myData.csv'
                },
                jsonFile: {
                    name: 'users.xml'
                },
                image: {
                    name: 'doggo.jpeg'
                }
            }
        }

        middleware (req, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining ({
            message: 'Invalid file extension'
        }))
    })
})