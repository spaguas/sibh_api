const express = require('express');
const cors = require('cors')
const { getStations, getMeasurements, getCities, getParameters } = require('./config/database');
const parameterRoutes = require('./routes/parameterRoutes')
const alertRoutes = require('./routes/alertRoutes')
const bodyParser = require('body-parser')
const IORedis = require('ioredis');

const app = express();
require('dotenv').config()


const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

redis.on('error', (err) => {
  console.error('Redis Error', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())


app.get('/stations', async (req, res) => {
  
  console.log(req.query);
  
  
  try {
    let response = await getStations(req.query)
    
    console.log(`stations?${JSON.stringify(req.query)}`);
    

    redis.set(`stations${new Date().getMilliseconds()}`, JSON.stringify(response), 'EX', 4000, (err, reply) => {
      if (err) {
        console.error(err);
      } else {
        console.log(reply); // OK
      }
    });

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

app.get('/test', async (req, res) =>{
  // redis.set('mykey', 'Hello, Redis!', (err, reply) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(reply); // OK
  //   }
  // });
  let value = 'ESTA TUDO OK'
  await redis.get('stations', (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      value = JSON.parse(reply)
      console.log(reply); // Hello, Redis!
    }
  });
  res.send(value)
})


module.exports = app