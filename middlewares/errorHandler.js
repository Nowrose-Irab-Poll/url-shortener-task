const INTERNAL_SERVER_ERROR = require('../utils/constants')
const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message || INTERNAL_SERVER_ERROR });
};

module.exports = errorHandler;
