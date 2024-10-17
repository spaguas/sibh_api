const express = require('express');
const cors = require('cors')
const { getStations, getMeasurements, getCities } = require('./config/database');
const app = express();
require('dotenv').config()
const port = process.env.HTTP_PORT


app.use(cors())

app.get('/stations', async (req, res) => {  
    let response = await getStations(req.query)
    res.send(JSON.stringify(response));
});

app.get('/measurements', async (req, res) => {  
  let response = await getMeasurements(req.query)
  res.send(JSON.stringify(response));
});

app.get('/cities', async (req, res) => {  
  let response = await getCities(req.query)
  res.send(JSON.stringify(response));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});