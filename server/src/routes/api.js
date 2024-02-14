const express = require('express');
const planetsRouter = require('./planets/planets.routers');
const launchRouter = require('./launches/launches.routers');

const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchRouter);

module.exports = api;