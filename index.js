const express = require('express');
const cors = require('cors')
const { testDBConnection, getStations, getMeasurements } = require('./data/database');
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});