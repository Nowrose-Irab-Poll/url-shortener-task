const UrlShortener = require('../services/UrlShortener');
const Base62Codec = require('../services/Base62Codec');
const { SHORT_URL_NOT_FOUND, INVALID_SHORT_KEY } = require('../utils/constants');

describe('Base62Codec', () => {
    beforeEach(() => {
        // Reset the counter for consistent test results
        Base62Codec.counter = Base62Codec.counterOffset;
    });

    describe('convert', () => {
        test('converts valid characters to correct Base62 index', () => {
            expect(Base62Codec.convert('a')).toBe(0);
            expect(Base62Codec.convert('z')).toBe(25);
            expect(Base62Codec.convert('A')).toBe(26);
            expect(Base62Codec.convert('Z')).toBe(51);
            expect(Base62Codec.convert('0')).toBe(52);
            expect(Base62Codec.convert('9')).toBe(61);
        });

        test('throws -1 for invalid characters', () => {
            expect(Base62Codec.convert('$')).toBe(-1);
            expect(Base62Codec.convert('!')).toBe(-1);
            expect(Base62Codec.convert(' ')).toBe(-1);
        });
    });

    describe('base10ToBase62', () => {
        test('throws INVALID_SHORT_KEY for numbers below counterOffset', () => {
            expect(() => Base62Codec.base10ToBase62(Base62Codec.counterOffset - 1)).toThrow(INVALID_SHORT_KEY);
        });

        test('converts valid Base10 numbers to Base62 strings', () => {
            expect(Base62Codec.base10ToBase62(Base62Codec.counterOffset)).toBe('baaaaa');
            expect(Base62Codec.base10ToBase62(Base62Codec.counterOffset + 1)).toBe('baaaab');
            expect(Base62Codec.base10ToBase62(Base62Codec.counterOffset + 62)).toBe('baaaba');
        });
    });

    describe('base62ToBase10', () => {
        test('throws SHORT_URL_NOT_FOUND for invalid characters', () => {
            expect(() => Base62Codec.base62ToBase10('abc$')).toThrow(SHORT_URL_NOT_FOUND);
            expect(() => Base62Codec.base62ToBase10('a b')).toThrow(SHORT_URL_NOT_FOUND);
        });

        test('converts valid Base62 strings to Base10 numbers', () => {
            expect(Base62Codec.base62ToBase10('baaaaa')).toBe(Base62Codec.counterOffset);
            expect(Base62Codec.base62ToBase10('baaaab')).toBe(Base62Codec.counterOffset + 1);
            expect(Base62Codec.base62ToBase10('baaaba')).toBe(Base62Codec.counterOffset + 62);
        });
    });

    describe('generateShortUrl', () => {
        test('generates unique short URLs with incrementing counter', () => {
            const first = Base62Codec.generateShortUrl();
            const second = Base62Codec.generateShortUrl();

            expect(first.uid).toBe(Base62Codec.counterOffset);
            expect(first.shortUrlKey).toBe('baaaaa');
            expect(second.uid).toBe(Base62Codec.counterOffset + 1);
            expect(second.shortUrlKey).toBe('baaaab');
        });

        // test('throws error for counter overflow', () => {
        //     Base62Codec.counter = Number.MAX_SAFE_INTEGER - 1;
        //     const first = Base62Codec.generateShortUrl();
        //     expect(first.uid).toBe(Number.MAX_SAFE_INTEGER - 1);

        //     const second = Base62Codec.generateShortUrl();
        //     expect(second.uid).toBe(Number.MAX_SAFE_INTEGER);

        //     // After MAX_SAFE_INTEGER, expect error or specific behavior
        //     expect(() => Base62Codec.generateShortUrl()).toThrow(); // Adjust if specific handling is implemented
        // });
    });
});


describe('UrlShortener', () => {
    test('createShortUrl stores mapping and returns short URL', () => {
        const longUrl = 'http://example.com';
        const shortUrl = UrlShortener.createShortUrl(longUrl);

        // Check short URL format
        expect(shortUrl.startsWith('http://localhost:3000/')).toBe(true);

        // Retrieve long URL
        const shortUrlKey = shortUrl.replace('http://localhost:3000/', '');
        const retrievedLongUrl = UrlShortener.getLongUrl(shortUrlKey);
        expect(retrievedLongUrl).toBe(longUrl);
    });

    test('getLongUrl returns null for invalid short keys', () => {
        expect(UrlShortener.getLongUrl('invalidKey')).toBeNull();
    });
});
