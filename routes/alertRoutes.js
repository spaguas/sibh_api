const express = require('express');
const router = express.Router();

const {getAlerts, insertAlert} = require('../config/alert_db')

router.get('/', async (req, res) => {
    let alerts = await getAlerts(req.query)
    res.send(alerts);
});
router.post('/new', async (req, res) => {   
    let result = await insertAlert(req.body)
    res.status(result.status).send(result);
});

module.exports = router
