const express = require('express');
const cors = require('cors')
const { getMeasurements, getCities, getParameters } = require('./config/database');
const parameterRoutes = require('./routes/parameterRoutes')
const alertRoutes = require('./routes/alertRoutes')
const stationRoutes = require('./routes/stationRoutes')
const measurementRoutes = require('./routes/measurementRoutes')
const lightningsRoutes = require('./routes/lightningRoutes')
const ugrhisRoutes = require('./routes/ugrhiRoutes')
const subugrhisRoutes = require('./routes/subugrhiRoutes')
const newMeasurementRoutes = require('./routes/newMeasurementRoutes')
const bodyParser = require('body-parser');
const { corsOptions } = require('./config/cors');

const app = express();
require('dotenv').config()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions))


app.get('/cities', async (req, res) => {
  let response  
  try{
    response = await getCities(req.query)
  } catch(e){
    console.log(e);
    
    res.status(500)
  }
  
  res.send(response);
});

app.use('/', parameterRoutes)
app.use('/alerts', alertRoutes)
app.use('/stations', stationRoutes)
app.use('/measurements', measurementRoutes)
app.use('/lightnings', lightningsRoutes)
app.use('/new_measurements', newMeasurementRoutes)
app.use('/ugrhis', ugrhisRoutes)
app.use('/subugrhis', subugrhisRoutes)

module.exports = app