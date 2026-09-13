const express = require('express');
const router = express.Router();

const {getDams, insertDamEvent} = require('../config/database/dam_db')
const { authenticateToken, authorize } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    let dams = await getDams(req.query)
    res.send(dams);
});

router.post('/events', authenticateToken, authorize(['dev', 'operator']), async (req, res) => {
    let result
    try{
        result = await insertDamEvent(req.body, req.user.id)
    } catch (e){
        console.log(e);
        res.status(400).send({error: 'Erro ao inserir evento de barragem'})
        return
    }

    res.status(result.status).send(result)
});

module.exports = router
