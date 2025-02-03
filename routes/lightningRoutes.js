
const express = require('express');
const { getLightnings } = require('../config/database/lightning_db');
const router = express.Router();


router.get('/last_lightnings', async (req, res) => {  
    let response = await getLightnings([-26.106681, -18.890425, -54.446606, -41.525717])
    res.send(response);
});

router.get('/last_lightnings/baixada', async (req, res) => {  
    let response = await getLightnings([-24.687430, -23.400726, -47.186430, -44.728239])
    res.send(response);
});

module.exports = router