const { SHORT_URL_NOT_FOUND, INVALID_SHORT_KEY, INTEGER_OVERFLOW } = require('../utils/constants');

class Base62Codec {
    static characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // for conversion of base62 to base10
    static counterOffset = process.env.COUNTER_OFFSET || 916132832;  // Start from a larger number (62^5) to avoid padding
    static counter = this.counterOffset;

    static base = 62;

    // converts Base62 character to Base10 integer
    static convert(c) {
        if (c >= 'a' && c <= 'z') {
            return c.charCodeAt(0) - 'a'.charCodeAt(0);
        }
        if (c >= 'A' && c <= 'Z') {
          return c.charCodeAt(0) - 'A'.charCodeAt(0) + 26;
        }
        if (c >= '0' && c <= '9') {
          return c.charCodeAt(0) - '0'.charCodeAt(0) + 52;
        }
        return -1;
    }

    static generateShortUrl() {
        if(this.counter > Number.MAX_SAFE_INTEGER) {
            throw new Error(INTEGER_OVERFLOW);
        }
        
        const uid = this.counter++; // Incremental Unique Id generation
        const shortUrlKey = this.base10ToBase62(uid);
        return {uid, shortUrlKey};
    }

    static base10ToBase62(uid) {
        if(uid < this.counterOffset ){
            throw new Error(INVALID_SHORT_KEY);
        }
        let shortUrlKey = '';

        // Convert the counter to a Base62 encoded string
        while (uid > 0) {
            shortUrlKey = this.characters[uid % this.base] + shortUrlKey;
            uid = Math.floor(uid / this.base);
        }
        return shortUrlKey;
    }

    static base62ToBase10(shortUrlKey) {
        // Convert the Base62 URL short key to a Base10 Unique Id
        let uid = 0;
        for (let i = 0; i < shortUrlKey.length; i++) {
            const b10 = this.convert(shortUrlKey.charAt(i));
            if(b10 == -1) {
                throw new Error(SHORT_URL_NOT_FOUND);
            }
            uid = uid * this.base + b10;
        }
        return uid;
    }
}

module.exports = Base62Codec;