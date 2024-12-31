const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {getUserByEmail} = require('../config/database/user')
const {generateToken} = require('../services/authService')
const {authenticateToken} = require('../middlewares/authMiddleware')

router.post('/login',  async (req, res) => {    
    const { email, password } = req.body;

    let user = await getUserByEmail(email)

    if(!user){
        return res.status(401).json({ error: 'Credenciais invalida' });
    }
    
    let compare = await bcrypt.compare(password, user.encrypted_password);
    
    if(!compare){
        return res.status(401).json({ error: 'Credenciais invalida' });
    }

    const token = generateToken(user.id)

    res.send({token})
});

router.post('/test', authenticateToken, async (req, res) => {    
    res.send(req.user)
});

module.exports = router
