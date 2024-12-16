const express = require('express');
const { shortenUrlController, redirectUrlController } = require('../controllers/urlController');

const router = express.Router();

router.post('/shorten', shortenUrlController);
router.get('/:shortUrl', redirectUrlController);

module.exports = router;
