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
            name: "Ádila",
            email: "anac@a.com",
            whatsapp: "85999295524",
            city: "Canindé",
            uf: "CE"
        });

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    });

    /* it('should be able to list all ONGs', async () => {
        const response = await request(app)
        .get('/ongs');

        expect(response.body).toHaveProperty('id');
    });*/
    
   afterAll(async () => {
        await connection.destroy();
    });

});