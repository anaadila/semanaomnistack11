const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe ('ONG', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        
        await connection.destroy()
    })

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    })

    it('should be able to list all ONGs', async () => {
        const objectOng = {
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        }

        const responseId = await request(app)
        .post('/ongs')
        .send(objectOng)

        const response = await request(app)
        .get('/ongs')


        expect(responseId.status).toBe(200)
        expect(responseId.body.id).toHaveLength(8)
        
        expect(response.status).toBe(200)
        expect(response.body).toMatchObject([objectOng])
        

    })
    
})