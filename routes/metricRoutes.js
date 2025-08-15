const {register, uniqueUsers} = require('@modules/metrics')
const express = require('express');
const { authenticateToken, authorize } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authenticateToken, authorize(['dev']), async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    // Inclui contagem de usuários únicos também
    res.end(metrics + `\nunique_users_total ${uniqueUsers.size}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router