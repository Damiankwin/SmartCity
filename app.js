const express = require('express');
const TrafficController = require('./controllers/trafficController');

const app = express();
app.use(express.json());

app.get('/api/traffic', TrafficController.getIntersections);
app.put('/api/traffic/:id', TrafficController.updateTraffic);

module.exports = app;
