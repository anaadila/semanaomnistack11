const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe ('Incidents', () => {
    beforeEach(async () => {
        await connection.migrate.rollback()
        await connection.migrate.latest()
    })

    afterAll(async () => { 
        await connection.destroy()
    })

    it('should be able to create a new incident', async () => {
        const newOng = {
            name: "New Ong",
            email: "newong@gmail.com",
            whatsapp: "85984759654",
            city: "São Paulo",
            uf: "SP"
        }

        const newIncident = {
            title: "New incident",
            description: "Description of the case",
            value: 300
        }

        const newOngID = await request(app).post('/ongs').send(newOng)

        const response = await request(app).post('/incidents').set("Authorization", newOngID.body.id).send(newIncident)
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
    })

    it('should be able to delete an existing incident', async () => {
        const newOng = {
            name: "New Ong",
            email: "newong@gmail.com",
            whatsapp: "85984759654",
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
        const newIncidentID = await request(app).post('/incidents').set("Authorization", newOngID.body.id).send(newIncident)
        const newIncidentID2 = await request(app).post('/incidents').set("Authorization", newOngID.body.id).send(newIncident2)
        
        const responseDel = await request(app).delete(`/incidents/${newIncidentID.body.id}`).set("Authorization", newOngID.body.id)

        expect(newOngID.status).toBe(200)
        expect(newIncidentID.status).toBe(200)
        expect(newIncidentID2.status).toBe(200)
        expect(responseDel.status).toBe(204)
    })
})