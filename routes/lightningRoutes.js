
const express = require('express');
const { getLightnings } = require('../config/database/lightning_db');
const router = express.Router();


router.get('/last_lightnings', async (req, res) => {  
    let response = await getLightnings([-26.106681, -18.890425, -54.446606, -41.525717])
    res.send(response);
});

router.get('/last_lightnings/baixada', async (req, res) => {  
    let response = await getLightnings([-45.145719, -23.019560, -47.194670, -24.607547])
    res.send(response);
});

module.exports = router