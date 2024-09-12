const express = require('express');
const cors = require('cors')
const { testDBConnection, getStations } = require('./data/database');
const app = express();
require('dotenv').config()
const port = process.env.PORT


app.use(cors())

app.get('/stations', async (req, res) => {
  console.log('sim');
  
    let response = await getStations(req.query)
    res.send(JSON.stringify(response));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});