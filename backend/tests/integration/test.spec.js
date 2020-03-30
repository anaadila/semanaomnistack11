const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe ('ONG', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });



    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    });

    it('should be able to list all ONGs', async () => {
        const objectOng = {
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        };

        const responseId = await request(app)
        .post('/ongs')
        .send(objectOng);

        const response = await request(app)
        .get('/ongs');


        expect(responseId.status).toBe(200);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([objectOng]);
        

    });
    
});


describe ('Incidents', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    it('should be able to create a new incident', async () => {
        const response = await request(app)
        .post('/incidents')
        .set("Authorization", "16d05f73")
        .send({
            "title": "Novo caso",
            "description": "Descrição de um novo caso",
            "value": 300
        });
        
        expect(response.body).toHaveProperty('id');
        expect(response.status).toBe(200);
    });

    it('should be able to list incidents of the ong logged in', async () => {

        const responseId = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        });

        const responseIncident = await request(app)
        .post('/incidents')
        .set("Authorization", responseId.body.id)
        .send({
            "title": "Novo caso",
            "description": "Descrição de um novo caso",
            "value": 300
        });

        //criando outro caso com outra authorization para testar se só lista os da ong "logada" no sistema
        const responseIncident2 = await request(app)
        .post('/incidents')
        .set("Authorization", "16d05f73")
        .send({
            "title": "Novo caso2",
            "description": "Descrição de um novo caso2",
            "value": 3003
        });

        const response = await request(app)
        .get('/incidents?page=1')
        .set("Authorization", responseId.body.id);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([{
            title:'Novo caso',
            description: 'Descrição de um novo caso',
            value: 300,
            name: 'ONG',
            email: 'ong@gmail.com',
            whatsapp: '8594659552',
            city: 'Fortaleza',
            uf: 'CE'
        }]);
    });

    it('should be able to delete an existing incident', async () => {

        const responseIncident = await request(app)
        .post('/incidents')
        .set("Authorization", "16d05f73")
        .send({
            "title": "Novo caso",
            "description": "Descrição de um novo caso",
            "value": 300
        });

        const responseDel = await request(app)
        .delete('/incidents/' + responseIncident.body.id)
        .set("Authorization", "16d05f73");

        expect(responseDel.status).toBe(204);
        expect(responseDel.body).toMatchObject({});
    });

});

describe ('Profile', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    it('should be able to list incidents of the profile logged in', async () => {

        const responseId = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        });

        const responseIncident = await request(app)
        .post('/incidents')
        .set("Authorization", responseId.body.id)
        .send({
            "title": "Novo caso",
            "description": "Descrição de um novo caso",
            "value": 300
        });

        const responseIncident2 = await request(app)
        .post('/incidents')
        .set("Authorization", responseId.body.id)
        .send({
            "title": "Novo caso2",
            "description": "Descrição de um novo caso2",
            "value": 3000
        });

        const response = await request(app)
        .get('/profile')
        .set("Authorization", responseId.body.id);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([{
            title: "Novo caso",
            description: "Descrição de um novo caso",
            value: 300
        }, {
            title: "Novo caso2",
            description: "Descrição de um novo caso2",
            value: 3000
        }]);
    });
});

describe ('Login', () => {
    beforeEach(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    it('should be able to login with an valid ong id', async () => {

        const responseId = await request(app)
        .post('/ongs')
        .send({
            name: "ONG",
            email: "ong@gmail.com",
            whatsapp: "8594659552",
            city: "Fortaleza",
            uf: "CE"
        });

        const response = await request(app)
        .post('/sessions')
        .send({
            id: responseId.body.id
        });

        console.log(response.body);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({name: "ONG"});
      
    });
});

afterAll(async () => {
        
    await connection.destroy();
})