// Capa HTTP.
const TrafficModel = require('../models/trafficModel');
const TrafficService = require('../services/trafficService');

const TrafficController = {
    getIntersections: (req, res) => res.json(TrafficModel.getAll()),

    updateTraffic: (req, res) => {
        try {
            const congestion = req.body ? req.body.congestion : undefined;
            const result = TrafficService.updateCongestion(req.params.id, congestion);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = TrafficController;
