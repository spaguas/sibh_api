const express = require('express');
const { testDBConnection, getStations } = require('./data/database');
const app = express();
const port = 10000;

app.get('/stations', async (req, res) => {
    let response = await getStations(req.query)
    res.send(JSON.stringify(response));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});