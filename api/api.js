const express = require('express');
const apiRouter = express.Router();

const stationRouter = require('./station.js');
apiRouter.use('/stations', stationRouter);

module.exports = apiRouter;