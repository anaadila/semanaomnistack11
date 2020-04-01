const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe ('Profile', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    it('should be able to list incidents of the profile logged in', async () => {

        const responseId = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        })

        const responseIncident = await request(app)
        .post('/incidents')
        .set("Authorization", responseId.body.id)
        .send({
            "title": "Novo caso",
            "description": "Descrição de um novo caso",
            "value": 300
        })

        const responseIncident2 = await request(app)
        .post('/incidents')
        .set("Authorization", responseId.body.id)
        .send({
            "title": "Novo caso2",
            "description": "Descrição de um novo caso2",
            "value": 3000
        })

        const response = await request(app)
        .get('/profile')
        .set("Authorization", responseId.body.id)

        expect(response.status).toBe(200)
        expect(response.body[0]).toHaveProperty('ong_id')
        /*expect(response.body).toMatchObject([{
            title: "Novo caso",
            description: "Descrição de um novo caso",
            value: 300
        }, {
            title: "Novo caso2",
            description: "Descrição de um novo caso2",
            value: 3000
        }])*/
    })
})