const PORT = process.env.PORT || 3000;

const express = require('express');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use('/', router);
app.use(errorHandler);

module.exports = app;
