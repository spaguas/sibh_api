const express = require('express');
const router = express.Router();
const cors = require('cors')

const {getAlerts, insertAlert} = require('../config/database/alert_db')
const {restrictedCors} = require('../config/cors')
const {validateAccess} = require('../middlewares/middlewares')

router.get('/', validateAccess, async (req, res) => {
    let alerts = await getAlerts(req.query)
    res.send(alerts);
});
router.post('/new', async (req, res) => {   
    let result = await insertAlert(req.body)
    res.status(result.status).send(result);
});

module.exports = router
