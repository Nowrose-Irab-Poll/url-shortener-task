const UrlShortener = require('../services/UrlShortener');
const { SHORT_URL_NOT_FOUND } = require('../utils/constants');

const shortenUrlController = (req, res) => {
    try {
        const { longUrl } = req.body;
        const shortUrl = UrlShortener.createShortUrl(longUrl);
        res.json({ shortUrl });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const redirectUrlController = (req, res) => {
    try {
        const { shortUrl } = req.params;
        const longUrl = UrlShortener.getLongUrl(shortUrl);

        if (!longUrl) {
            throw new Error(SHORT_URL_NOT_FOUND);
        }

        res.redirect(longUrl);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = { shortenUrlController, redirectUrlController };
