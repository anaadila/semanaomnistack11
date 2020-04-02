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

    it('should be receive five itens by page', async () => {

        const newOng = {
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        }
        //criando 6 casos para ver se só vai retornar 5
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
        const newIncident3 = {
            title: "New incident3",
            description: "Description of the case3",
            value: 300
        }
        const newIncident4 = {
            title: "New incident4",
            description: "Description of the case4",
            value: 300
        }
        const newIncident5 = {
            title: "New incident5",
            description: "Description of the case5",
            value: 300
        }
        const newIncident6 = {
            title: "New incident6",
            description: "Description of the case6",
            value: 300
        }

        const responseId = await request(app).post('/ongs').send(newOng)

        const responseIncident = await request(app).post('/incidents').set("Authorization", responseId.body.id).send(newIncident)
        const responseIncident2 = await request(app).post('/incidents').set("Authorization", responseId.body.id).send(newIncident2)
        const responseIncident3 = await request(app).post('/incidents').set("Authorization", responseId.body.id).send(newIncident3)
        const responseIncident4 = await request(app).post('/incidents').set("Authorization", responseId.body.id).send(newIncident4)
        const responseIncident5 = await request(app).post('/incidents').set("Authorization", responseId.body.id).send(newIncident5)
        const responseIncident6 = await request(app).post('/incidents').set("Authorization", responseId.body.id).send(newIncident6)

        const response = await request(app).get('/incidents').set("Authorization", responseId.body.id);
        const response2 = await request(app).get('/incidents?page=2').set("Authorization", responseId.body.id);

        expect(responseId.status).toBe(200)
        expect(responseIncident.status).toBe(200)
        expect(responseIncident2.status).toBe(200)
        expect(responseIncident3.status).toBe(200)
        expect(responseIncident4.status).toBe(200)
        expect(responseIncident5.status).toBe(200)
        expect(responseIncident6.status).toBe(200)

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(5)

        expect(response2.status).toBe(200)
        expect(response2.body.length).toBe(1)
    })
})