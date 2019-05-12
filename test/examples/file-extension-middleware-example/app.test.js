const request = require ('supertest')
const app = require ('../../../examples/file-extension-middleware-example/app')
const path = require ('path')


describe ('app with file extension middleware', () => {
    it ('returns a 200 when every file use the right extension', () => {
        return request (app)
            .post ('/')
            .attach ('image', 'test/fixtures/file-extension-middleware-example/image.jpg')
            .attach ('data', 'test/fixtures/file-extension-middleware-example/file.json')
            .then (response => {
                expect (response.statusCode).toBe (200)
                expect (response.text).toBe ('Ok')
            })
    })

    it ('returns a 400 when a file is not using the right extension', () => {
        return request (app)
            .post ('/')
            .field ('field', 'hello')
            .attach ('image', 'test/fixtures/file-extension-middleware-example/image.jpg')
            .attach ('data', 'test/fixtures/file-extension-middleware-example/file.xml')
            .then (response => {
                expect (response.statusCode).toBe (400)
                expect (response.text).toBe ('Error')
            })
    })
})