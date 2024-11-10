const express = require('express');
const cors = require('cors')
const { getStations, getMeasurements, getCities, getParameters } = require('./config/database');
const parameterRoutes = require('./routes/parameterRoutes')
const alertRoutes = require('./routes/alertRoutes')

const app = express();
require('dotenv').config()

app.use(cors())

app.get('/stations', async (req, res) => {
  try {
    let response = await getStations(req.query)
    res.send(response);
  } catch(e){
    res.status(500)
  }
});

app.get('/measurements', async (req, res) => {  
  try{
    let response = await getMeasurements(req.query)
    if(response.details){
        res.status(400)
    }
    let references
    if(req.query['parameter_type_ids']){
      references = await getParameters({parameterizable_type: 'StationPrefix', parameterizable_ids: req.query.station_prefix_ids, parameter_type_ids: req.query.parameter_type_ids})
    }
    res.send({measurements: response, references: references});
  } catch (e){
    res.status(500)
  }
  
});

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


module.exports = app