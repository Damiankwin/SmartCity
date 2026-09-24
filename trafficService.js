// Capa de negocio: reglas del semáforo.
const TrafficModel = require('../models/trafficModel');

// > 100 => red | > 75 => yellow | resto => green
const getLightFor = (congestion) => {
    if (congestion > 100) return 'red';      // BUG-02 corregido (antes 'green')
    if (congestion > 75) return 'yellow';
    return 'green';
};

const TrafficService = {
    updateCongestion: (id, newCongestion) => {
        // BUG-03 corregido: validar ANTES de tocar el estado.
        if (typeof newCongestion !== 'number' || !Number.isFinite(newCongestion)) {
            throw new Error('La congestión debe ser un número válido');
        }
        if (newCongestion < 0) {
            throw new Error('La congestión no puede ser negativa');
        }

        const intersection = TrafficModel.findById(id);

        // BUG-01 corregido: error controlado en lugar de TypeError sobre undefined.
        if (!intersection) {
            throw new Error(`Intersección con id ${id} no encontrada`);
        }

        intersection.congestion = newCongestion;
        intersection.light = getLightFor(newCongestion);
        return intersection;
    }
};

module.exports = TrafficService;
