import app from 'server';
import supertest from "supertest";

const api = supertest(app);

describe('/POST fruits', () => {
    it('Should return 422 if request is invalid', async () => {
        const fruitRequest = {
            name: 50
        };
        const response = await api.post('/fruits').send(fruitRequest);
        expect(response.statusCode).toBe(422);
    })

    it('Should return 201 if request is valid', async () => {
        const fruitRequest = {
            name: 'Dragon Fruit',
            price: 5000
        };

        const fruitRequest2 = {
            name: 'Banana',
            price: 1000
        };

        const response = await api.post('/fruits').send(fruitRequest);

        await api.post('/fruits').send(fruitRequest2);

        expect(response.statusCode).toBe(201);
    })

    it('Should return 409 if fruit already exists', async () => {
        const fruitRequest = {
            name: 'Dragon Fruit',
            price: 5000
        };
        const response = await api.post('/fruits').send(fruitRequest);
        expect(response.statusCode).toBe(409);
    })
})

describe('/GET fruits', () => {
    it('Should return 200 and correct fruits', async () => {
        const response = await api.get('/fruits');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String),
                    price: expect.any(Number),
                    id: expect.any(Number)
                })

            ])
        )
    })
})

describe('/GET fruits/:id', () => {
    it('Should return 404 if id does not exists', async () => {
        const response = await api.get('/fruits/10');
        expect(response.statusCode).toBe(404);
    })

    it('Should return 200 and data if request is valid', async () => {
        const response = await api.get('/fruits/1');
        expect(response.body).toEqual(
            expect.objectContaining({
                name: expect.any(String),
                price: expect.any(Number),
                id: 1
            }));
    })
})