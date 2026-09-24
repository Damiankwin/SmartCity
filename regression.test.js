/**
 * PRUEBAS DE REGRESIÓN (R1 y R2)
 * Documentan los bugs originales y garantizan que no vuelvan a aparecer.
 * Stack completo real (Model + Service + Controller + rutas).
 */
const request = require('supertest');
const TrafficModel = require('../../src/models/trafficModel');
const app = require('../../src/app');

describe('Regresión - bugs intencionales del código original', () => {
    beforeEach(() => TrafficModel.reset());

    test('R1 (BUG-01): un id inexistente responde 400 con mensaje claro y el servidor sigue vivo', async () => {
        const res = await request(app).put('/api/traffic/999').send({ congestion: 50 });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/no encontrada/);
        // El bug original filtraba: "Cannot set properties of undefined (setting 'congestion')"
        expect(res.body.error).not.toMatch(/undefined/);

        // El servidor sigue respondiendo después del error
        const after = await request(app).get('/api/traffic');
        expect(after.status).toBe(200);
    });

    test('R2 (BUG-02): una congestión de 120% fuerza la luz en red (nunca green)', async () => {
        const res = await request(app).put('/api/traffic/1').send({ congestion: 120 });

        expect(res.status).toBe(200);
        expect(res.body.light).toBe('red');
        expect(res.body.light).not.toBe('green');
    });
});
