const express = require('express');
const cors = require('cors')
const { testDBConnection, getStations } = require('./data/database');
const app = express();
const port = 555;


app.use(cors())

app.get('/stations', async (req, res) => {
    let response = await getStations(req.query)
    res.send(JSON.stringify(response));
});

app.listen(80, () => {
  console.log(`Server listening on port ${port}`);
});