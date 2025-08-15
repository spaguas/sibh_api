require('module-alias/register');
require('dotenv').config()

const express = require('express');
const cors = require('cors');
const { getMeasurements, getCities, getParameters } = require('./config/database');
const parameterRoutes = require('./routes/parameterRoutes')
const alertRoutes = require('./routes/alertRoutes')
const stationRoutes = require('./routes/stationRoutes')
const measurementRoutes = require('./routes/measurementRoutes')
const lightningsRoutes = require('./routes/lightningRoutes')
const ugrhisRoutes = require('./routes/ugrhiRoutes')
const subugrhisRoutes = require('./routes/subugrhiRoutes')
const cityRoutes = require('./routes/cityRoutes')
const newMeasurementRoutes = require('./routes/newMeasurementRoutes')
const hidroappRoutes = require('./routes/hidroappRoutes')
const authRoutes = require('./routes/auth')
const s3Routes = require('./routes/s3Routes')
const bodyParser = require('body-parser');
const metricRoutes = require("@routes/metricRoutes")
const { corsOptions } = require('./config/cors');
const { metricsMiddleware } = require('@middlewares/middlewares')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions))
app.use(metricsMiddleware)

app.use('/', parameterRoutes)
app.use('/alerts', alertRoutes)
app.use('/stations', stationRoutes)
app.use('/measurements', measurementRoutes)
app.use('/lightnings', lightningsRoutes)
app.use('/new_measurements', newMeasurementRoutes)
app.use('/ugrhis', ugrhisRoutes)
app.use('/subugrhis', subugrhisRoutes)
app.use('/auth', authRoutes)
app.use('/cities', cityRoutes)
app.use('/hidroapp_stats', hidroappRoutes)
app.use('/s3', s3Routes)
app.use('/metrics', metricRoutes)

module.exports = app