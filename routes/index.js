const express = require('express');
const urlRoutes = require('./urlRoutes');

const router = express.Router();

router.use('/', urlRoutes);

module.exports = router;
    