const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe ('Login', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        
        await connection.destroy()
    })

    it('should be able to login with an valid ong id', async () => {

        const responseId = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        })

        const response = await request(app)
        .post('/sessions')
        .send({
            id: responseId.body.id
        })

        expect(response.status).toBe(200)
        expect(response.body).toMatchObject({name: "ONG"})
      
    })
})