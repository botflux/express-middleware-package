const fileExistsMiddleware = require('../../src/middleware/properties-exist-middleware')

describe ('#fileExistsMiddleware', () => {
    it ('throws an error when propertyName is undefined', () => {
        const f = () => fileExistsMiddleware (undefined, [])

        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertyName_ must be defined')
    })

    it ('throws an error when propertyName is not a string', () => {
        const f = () => fileExistsMiddleware (124, [])

        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertyName_ must be a String')
    })

    it ('throws an error when fileLists is undefined', () => {
        const f = () => fileExistsMiddleware ('files', undefined)
        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertiesList_ must be defined')
    })

    it ('throws an error when fileList is not an array', () => {
        const f = () => fileExistsMiddleware ('files', {})
        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertiesList_ must be an array')
    })

    it ('throws an error when the request object has no _propertyName_ property', () => {
        const middleware = fileExistsMiddleware ('body', [])
        const next = jest.fn ()
        
        const f = () => middleware ({
            
        }, {}, next)

        expect (f).toThrow (Error)
        expect (f).toThrow ('The property _body_ specified by _propertyName_ in file-exists-middleware is not defined')
        expect (next).toBeCalledTimes (0)
    })

    it ('throws an error when the request property _propertyName_ is an array', () => {
        const middleware = fileExistsMiddleware ('files', [])
        const next = jest.fn ()
        
        const f = () => middleware ({
            files: []
        }, {}, next)

        expect (f).toThrow (Error)
        expect (f).toThrow ('The request property _files_ specified by _propertyName_ must be an object')
        expect (next).toBeCalledTimes (0)
    })

    it ('throws an error when the request property _propertyName_ is not an object', () => {
        const middleware = fileExistsMiddleware ('files', [])
        const next = jest.fn ()
        
        const f = () => middleware ({
            files: 'Not an object'
        }, {}, next)

        expect (f).toThrow (Error)
        expect (f).toThrow ('The request property _files_ specified by _propertyName_ must be an object')
        expect (next).toBeCalledTimes (0)
    })

    it ('calls next with an error when a file is missing', () => {
        const middleware = fileExistsMiddleware ('files', [ 'myFile' ])
        const next = jest.fn ()

        middleware ({ files: {} }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining ({
            message: expect.stringContaining ('A property is missing')
        }))
    })

    it ('calls next with an error when more than one file is missing', () => {
        const middleware = fileExistsMiddleware ('files', [ 'myFile', 'data', 'data-compressed' ])
        const next = jest.fn ()

        middleware ({ 
            files: {
                'data-compressed': {}
            } 
        }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining ({
            message: expect.stringContaining ('A property is missing')
        }))
    })

    it ('calls next when every specified file is defined', () => {
        const middleware = fileExistsMiddleware ('files', [ 'myFile' ])
        const next = jest.fn ()

        middleware ({ 
            files: { 
                myFile: {}
            } 
        }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next.mock.calls[0].length).toBe (0)
    })

    it ('calls next when every specified files are defined', () => {
        const middleware = fileExistsMiddleware ('files', [
            'myFile', 'file', 'data'
        ])

        const req = {
            files: {
                myFile: {},
                file: {},
                data: {}
            }
        }

        const next = jest.fn ()

        middleware (req, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next.mock.calls[0].length).toBe (0)
    })

    it ('calls next with an error when a files is undefined', () => {
        const middleware = fileExistsMiddleware ('files', [ 'myFile' ])
        const next = jest.fn ()

        middleware ({
            files: {
                myFile: undefined
            }
        }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining ({
            message: expect.stringContaining ('A property is missing')
        }))
    })

    it ('calls next with an error when more than one file is undefined', () => {
        const middleware = fileExistsMiddleware ('files', [ 'myFile', 'data', 'file' ])
        const next = jest.fn ()

        middleware ({
            files: {
                myFile: undefined,
                data: undefined,
                file: {}
            }
        }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining ({
            message: expect.stringContaining ('A property is missing')
        }))
    })
})