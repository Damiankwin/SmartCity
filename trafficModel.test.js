/**
 * PRUEBAS UNITARIAS - TrafficModel (U1 a U3)
 * Modelo real, sin dependencias externas. Se restaura el estado antes de cada prueba.
 */
const TrafficModel = require('../../src/models/trafficModel');

describe('Unitarias - TrafficModel.findById', () => {
    beforeEach(() => TrafficModel.reset());

    test('U1: devuelve la intersección correcta cuando el id (número) existe', () => {
        expect(TrafficModel.findById(1)).toEqual({
            id: 1,
            name: 'Avenida Central',
            congestion: 40,
            light: 'green'
        });
    });

    test('U2: acepta el id como string (llega así desde req.params)', () => {
        const result = TrafficModel.findById('2');
        expect(result).toBeDefined();
        expect(result.name).toBe('Bulevar Norte');
    });

    test('U3: devuelve undefined (sin lanzar) para ids inexistentes o mal formados', () => {
        const invalidIds = [999, '999', 'abc', '1abc', '', undefined, null];
        invalidIds.forEach((id) => {
            expect(TrafficModel.findById(id)).toBeUndefined();
        });
    });
});
