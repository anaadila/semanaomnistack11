const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('No found ONG', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        
        await connection.destroy()
    })

    it('should be show a message because not found ONG with this ID', async () => {
        const response = await request(app)
        .post('/sessions')
        .send({
            id: "16d05f73"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("error")
    })
})