/**
 * PRUEBAS UNITARIAS - TrafficService.updateCongestion (U4 a U10)
 * El modelo está MOCKEADO: se prueba únicamente la lógica del servicio, aislada.
 */
jest.mock('../../src/models/trafficModel');

const TrafficModel = require('../../src/models/trafficModel');
const TrafficService = require('../../src/services/trafficService');

const makeIntersection = (overrides = {}) => ({
    id: 1,
    name: 'Avenida Central',
    congestion: 40,
    light: 'green',
    ...overrides
});

describe('Unitarias - TrafficService.updateCongestion', () => {
    beforeEach(() => jest.resetAllMocks());

    test('U4: congestión 50 actualiza el valor y deja la luz en green', () => {
        const target = makeIntersection({ congestion: 10, light: 'yellow' });
        TrafficModel.findById.mockReturnValue(target);

        const result = TrafficService.updateCongestion(1, 50);

        expect(TrafficModel.findById).toHaveBeenCalledWith(1);
        expect(result).toBe(target);
        expect(result).toMatchObject({ congestion: 50, light: 'green' });
    });

    test('U5: congestión 80 pone la luz en yellow', () => {
        TrafficModel.findById.mockReturnValue(makeIntersection());

        const result = TrafficService.updateCongestion(1, 80);

        expect(result).toMatchObject({ congestion: 80, light: 'yellow' });
    });

    test('U6: valores límite 75 / 100 respetan los umbrales (75=green, 100=yellow, >100=red)', () => {
        const cases = [
            [75, 'green'],
            [75.1, 'yellow'],
            [100, 'yellow'],
            [100.1, 'red']
        ];
        cases.forEach(([value, expectedLight]) => {
            TrafficModel.findById.mockReturnValue(makeIntersection());
            expect(TrafficService.updateCongestion(1, value).light).toBe(expectedLight);
        });
    });

    test('U7: id inexistente lanza un Error controlado (no un TypeError)', () => {
        TrafficModel.findById.mockReturnValue(undefined);

        let caught;
        try {
            TrafficService.updateCongestion(999, 50);
        } catch (error) {
            caught = error;
        }

        expect(caught).toBeInstanceOf(Error);
        expect(caught).not.toBeInstanceOf(TypeError);
        expect(caught.message).toMatch(/no encontrada/);
    });

    test('U8: congestión negativa lanza error y NO modifica la intersección', () => {
        const target = makeIntersection();
        TrafficModel.findById.mockReturnValue(target);

        expect(() => TrafficService.updateCongestion(1, -5)).toThrow(/negativa/);
        expect(target).toMatchObject({ congestion: 40, light: 'green' });
    });

    test('U9: tipos de dato incorrectos lanzan error y no modifican el estado', () => {
        const invalidValues = ['abc', '50', null, undefined, NaN, Infinity, {}, [], true];
        invalidValues.forEach((value) => {
            const target = makeIntersection();
            TrafficModel.findById.mockReturnValue(target);

            expect(() => TrafficService.updateCongestion(1, value)).toThrow(/número/);
            expect(target).toMatchObject({ congestion: 40, light: 'green' });
        });
    });

    test('U10: el valor 0 es válido (no debe tratarse como "falsy")', () => {
        TrafficModel.findById.mockReturnValue(makeIntersection());

        const result = TrafficService.updateCongestion(1, 0);

        expect(result).toMatchObject({ congestion: 0, light: 'green' });
    });
});
