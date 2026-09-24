/**
 * INTEGRACIÓN TOP-DOWN (TD1 a TD3)
 * Se prueba desde arriba: HTTP -> Controller -> Service (reales).
 * La capa inferior (Model) está MOCKEADA como stub.
 */
jest.mock('../../src/models/trafficModel');

const request = require('supertest');
const TrafficModel = require('../../src/models/trafficModel');
const app = require('../../src/app');

describe('Integración Top-Down (Modelo mockeado)', () => {
    beforeEach(() => jest.resetAllMocks());

    test('TD1: PUT válido recorre Controller -> Service y responde 200 con la luz calculada', async () => {
        TrafficModel.findById.mockReturnValue({
            id: 1, name: 'Avenida Central', congestion: 40, light: 'green'
        });

        const res = await request(app).put('/api/traffic/1').send({ congestion: 80 });

        expect(res.status).toBe(200);
        expect(TrafficModel.findById).toHaveBeenCalledWith('1');
        expect(res.body).toMatchObject({ id: 1, congestion: 80, light: 'yellow' });
    });

    test('TD2: si el Modelo no encuentra la intersección, la API responde 400 con mensaje claro', async () => {
        TrafficModel.findById.mockReturnValue(undefined);

        const res = await request(app).put('/api/traffic/999').send({ congestion: 50 });

        expect(res.status).toBe(400);
        expect(TrafficModel.findById).toHaveBeenCalledWith('999');
        expect(res.body.error).toMatch(/no encontrada/);
    });

    test('TD3: un body con tipo incorrecto responde 400 y no altera lo devuelto por el Modelo', async () => {
        const target = { id: 1, name: 'Avenida Central', congestion: 40, light: 'green' };
        TrafficModel.findById.mockReturnValue(target);

        const res = await request(app).put('/api/traffic/1').send({ congestion: 'alto' });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/número/);
        expect(target).toMatchObject({ congestion: 40, light: 'green' });
    });
});
