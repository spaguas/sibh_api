const express = require('express');
const router = express.Router();
const cors = require('cors')

const {getAlerts, insertAlert} = require('../config/database/alert_db')
const {validateAccess} = require('../middlewares/middlewares')

router.get('/',  async (req, res) => {
    let alerts = await getAlerts(req.query)
    res.send(alerts);
});
router.post('/new', async (req, res) => {  
    let result 
    try{
        result = await insertAlert(req.body)
    } catch (e){
        console.log(e);
        res.status(400).send({error: 'Erro ao inserir alerta'})
    }
    
    res.status(result.status).send(result)
});

module.exports = router
