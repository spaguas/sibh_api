require('module-alias/register');
require('dotenv').config()

const express = require('express');
const qs = require('qs');
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
const decreeRoutes = require('./routes/decreeRoutes')
const damRoutes = require('./routes/damRoutes')

const app = express();

//mantém o comportamento de parsing de query string do Express 4 (arrays via repetição/colchetes).
//usa parser customizado (em vez da string 'extended') porque o qs >=6.14.2 passou a limitar arrays
//via colchetes [] a 20 itens por padrão (arrayLimit); várias rotas recebem listas de ids maiores que isso
app.set('query parser', (str) => qs.parse(str, { arrayLimit: 1000 }));

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
app.use('/decrees', decreeRoutes)
app.use('/dams', damRoutes)

//middleware de erro global: no Express 5, erros (inclusive promises rejeitadas em handlers async)
//chegam aqui via next(err) em vez de derrubar o processo
app.use((err, req, res, next) => {
    console.error('Erro não tratado numa rota:', err)

    if(res.headersSent){
        return next(err)
    }

    res.status(500).send({error: 'Erro interno no servidor'})
})

module.exports = app