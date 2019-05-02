const request = require('supertest')
const app = require('../../../examples/properties-exist-middleware-example/app')

describe ('app with properties exist middleware', () => {
    it ('returns a 200 with a JSON when the fields are specified', () => {
        return request (app)
            .post('/')
            .send ('firstName=John')
            .send ('lastName=Doe')
            .expect ('Content-Type', /json/)
            .expect (200)
            .expect ({ firstName: 'John', lastName: 'Doe' })
    })

    it ('retuns a 400 with a JSON when a field is missing', () => {
        return request (app)
            .post ('/')
            .send ('firstName=John')
            .send ('age=20')
            .expect ('Content-Type', /json/)
            .expect (400)
            .expect ({ message: 'A property is missing' })
    })
})