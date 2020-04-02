const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('Unauthorized Delete Incidents', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => {
        
        await connection.destroy()
    })

    it('should be show a message because cant delete incident unauthorized', async () => {
        const newOng = {
            name: "New Ong",
            email: "newong@gmail.com",
            whatsapp: "85984759654",
            city: "São Paulo",
            uf: "SP"
        }

        const newOng2 = {
            name: "New Ong2",
            email: "newong2@gmail.com",
            whatsapp: "85984759655",
            city: "São Paulo",
            uf: "SP"
        }

        const newIncident = {
            title: "New incident",
            description: "Description of the case",
            value: 300
        }

        const newIncident2 = {
            title: "New incident2",
            description: "Description of the case2",
            value: 300
        }

        const newOngID = await request(app).post('/ongs').send(newOng)
        const newOngID2 = await request(app).post('/ongs').send(newOng2)
        const newIncidentID = await request(app).post('/incidents').set("Authorization", newOngID.body.id).send(newIncident)
        const newIncidentID2 = await request(app).post('/incidents').set("Authorization", newOngID2.body.id).send(newIncident2)
        
        const responseDel = await request(app).delete(`/incidents/${newIncidentID2.body.id}`).set("Authorization", newOngID.body.id)

        expect(newOngID.status).toBe(200)
        expect(newOngID2.status).toBe(200)
        expect(newIncidentID.status).toBe(200)
        expect(newIncidentID2.status).toBe(200)
        expect(responseDel.status).toBe(401)
        expect(responseDel.body).toHaveProperty("error")
    })
})
