// Capa de datos (en memoria).
const SEED = [
    { id: 1, name: 'Avenida Central', congestion: 40, light: 'green' },
    { id: 2, name: 'Bulevar Norte', congestion: 85, light: 'red' }
];

const cloneSeed = () => SEED.map((i) => ({ ...i }));

let intersections = cloneSeed();

const TrafficModel = {
    getAll: () => intersections,

    // Devuelve la intersección o undefined si no existe.
    // Solo acepta ids enteros positivos ("1", 1). Rechaza "abc" y "1abc".
    findById: (id) => {
        if (!/^\d+$/.test(String(id))) return undefined;
        const numericId = Number.parseInt(id, 10);
        return intersections.find((i) => i.id === numericId);
    },

    // Utilidad para pruebas: restaura los datos iniciales.
    reset: () => {
        intersections = cloneSeed();
    }
};

module.exports = TrafficModel;
