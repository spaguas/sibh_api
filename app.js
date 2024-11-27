const express = require('express');
const cors = require('cors')
const { getMeasurements, getCities, getParameters } = require('./config/database');
const parameterRoutes = require('./routes/parameterRoutes')
const alertRoutes = require('./routes/alertRoutes')
const stationRoutes = require('./routes/stationRoutes')
const measurementRoutes = require('./routes/measurementRoutes')
const lightningsRoutes = require('./routes/lightningRoutes')
const bodyParser = require('body-parser')
// const IORedis = require('ioredis');

const app = express();
require('dotenv').config()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


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

module.exports = app