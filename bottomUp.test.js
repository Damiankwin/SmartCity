/**
 * INTEGRACIÓN BOTTOM-UP (BU1 a BU3)
 * Se prueba desde abajo: Model REAL + Service REAL (sin HTTP ni mocks).
 */
const TrafficModel = require('../../src/models/trafficModel');
const TrafficService = require('../../src/services/trafficService');

describe('Integración Bottom-Up (Modelo + Servicio reales)', () => {
    beforeEach(() => TrafficModel.reset());

    test('BU1: el Servicio persiste en el Modelo la congestión y la luz yellow', () => {
        TrafficService.updateCongestion(1, 95);

        expect(TrafficModel.findById(1)).toMatchObject({ congestion: 95, light: 'yellow' });
    });

    test('BU2: congestión 130 en id "2" deja la luz red y no toca las demás intersecciones', () => {
        TrafficService.updateCongestion('2', 130);

        const all = TrafficModel.getAll();
        expect(all.find((i) => i.id === 2)).toMatchObject({ congestion: 130, light: 'red' });
        expect(all.find((i) => i.id === 1)).toEqual({
            id: 1, name: 'Avenida Central', congestion: 40, light: 'green'
        });
    });

    test('BU3: id inexistente o valor inválido lanzan error y dejan el Modelo intacto', () => {
        const snapshot = JSON.parse(JSON.stringify(TrafficModel.getAll()));

        expect(() => TrafficService.updateCongestion(999, 50)).toThrow(/no encontrada/);
        expect(() => TrafficService.updateCongestion(1, -10)).toThrow(/negativa/);
        expect(TrafficModel.getAll()).toEqual(snapshot);
    });
});
