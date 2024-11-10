const {getParameters} = require('../config/database')
const express = require('express');
const router = express.Router();

router.get('/parameters', async (req, res) => {  
    res.send(await getParameters(req.query));
});

router.post('/parameters', async (req, res) => {  
    let response = await newParameters(req.query)
    res.send(response);
});

module.exports = router