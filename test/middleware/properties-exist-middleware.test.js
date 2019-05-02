const fileExistsMiddleware = require('../../src/middleware/properties-exist-middleware')

describe ('#fileExistsMiddleware', () => {
    it ('throws an error when _propertyName_ is undefined', () => {
        const f = () => fileExistsMiddleware (undefined, [])

        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertyName_ must be defined')
    })

    it ('throws an error when _propertyName_ is not a string', () => {
        const f = () => fileExistsMiddleware (124, [])

        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertyName_ must be a String')
    })

    it ('throws an error when _propertiesList_ is undefined', () => {
        const f = () => fileExistsMiddleware ('files', undefined)
        expect(f).toThrow (Error)
        expect(f).toThrow ('_propertiesList_ must be defined')
    })

    it ('throws an error when _propertiesList_ is not an array', () => {
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

    it ('calls next with an error when a property is missing', () => {
        const middleware = fileExistsMiddleware ('files', [ 'myFile' ])
        const next = jest.fn ()

        middleware ({ files: {} }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining ({
            message: expect.stringContaining ('A property is missing')
        }))
    })

    it ('calls next with an error when more than one property is missing', () => {
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

    it ('calls next when every specified property is defined', () => {
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

    it ('calls next when every specified properties are defined', () => {
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

    it ('calls next with an error when a properties is undefined', () => {
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

    it ('calls next with an error when more than one property is undefined', () => {
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

    it ('calls next when properties defined and a unchecked property', () => {
        const middleware = fileExistsMiddleware ('body', [ 'lastName', 'firstName', 'age' ])
        const next = jest.fn ()

        middleware ({
            body: {
                lastName: 'Doe',
                firstName: 'John',
                age: 20
            }
        }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next.mock.calls[0].length).toBe (0)
    })

    it ('calls next with an error when a property is missing and unchecked property', () => {
        const middleware = fileExistsMiddleware ('body', [ 'lastName', 'age' ])
        const next = jest.fn ()

        middleware ({
            body: {
                lastName: 'Doe',
                firstName: 'John'
            }
        }, {}, next)

        expect (next).toBeCalledTimes (1)
        expect (next).toBeCalledWith (expect.objectContaining({
            message: expect.stringContaining ('A property is missing')
        }))
    })
})