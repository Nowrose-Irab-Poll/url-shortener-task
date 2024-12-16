const Base62Codec = require('./Base62Codec');
const { INVALID_URL } = require('../utils/constants');
const { validateUrl, validateShortUrlKey } = require('../validators/validateUrl');

class UrlShortener {
    static urlStore = new Map();

    static createShortUrl(longUrl) {
        if (!longUrl || !validateUrl(longUrl)) {
            throw new Error(INVALID_URL);
        }

        const { uid, shortUrlKey } = Base62Codec.generateShortUrl();
        this.urlStore.set(uid, longUrl);

        return `${process.env.BASE_URL || 'http://localhost:3000/'}${shortUrlKey}`;
    }

    static getLongUrl(shortUrlKey) {

        if (!shortUrlKey || !validateShortUrlKey(shortUrlKey)) {
            throw new Error(INVALID_URL);
        }

        const uid = Base62Codec.base62ToBase10(shortUrlKey);
        return this.urlStore.get(uid) || null;
    }
}

module.exports = UrlShortener;
