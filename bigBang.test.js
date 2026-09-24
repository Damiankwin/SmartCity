/**
 * INTEGRACIÓN BIG BANG (BB1 a BB3)
 * Todos los módulos reales integrados a la vez, atacando la ruta PUT vía HTTP.
 */
const request = require('supertest');
const TrafficModel = require('../../src/models/trafficModel');
const app = require('../../src/app');

describe('Integración Big Bang (API completa, ruta PUT)', () => {
    beforeEach(() => TrafficModel.reset());

    test('BB1: PUT /api/traffic/1 con 60 responde 200 green y el cambio se ve en el GET', async () => {
        const put = await request(app).put('/api/traffic/1').send({ congestion: 60 });

        expect(put.status).toBe(200);
        expect(put.body).toMatchObject({ id: 1, congestion: 60, light: 'green' });

        const get = await request(app).get('/api/traffic');
        expect(get.status).toBe(200);
        expect(get.body.find((i) => i.id === 1)).toMatchObject({ congestion: 60, light: 'green' });
    });

    test('BB2: PUT /api/traffic/2 con 90 cambia la luz a yellow', async () => {
        const res = await request(app).put('/api/traffic/2').send({ congestion: 90 });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: 2, congestion: 90, light: 'yellow' });
    });

    test('BB3: payloads inválidos (negativo, texto, vacío) responden 400 y no cambian el estado', async () => {
        const invalidBodies = [{ congestion: -1 }, { congestion: '50' }, {}];

        for (const body of invalidBodies) {
            const res = await request(app).put('/api/traffic/1').send(body);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        }

        const get = await request(app).get('/api/traffic');
        expect(get.body.find((i) => i.id === 1)).toMatchObject({ congestion: 40, light: 'green' });
    });
});
