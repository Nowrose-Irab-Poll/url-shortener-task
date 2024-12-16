const { validateUrl, validateShortUrlKey }  = require('../validators/validateUrl');


describe('validateUrl', () => {
    test('valid URLs pass validation', () => {
        expect(validateUrl('http://example.com')).toBe(true);
        expect(validateUrl('https://example.com')).toBe(true);
        expect(validateUrl('http://example.com:8080')).toBe(true);
        expect(validateUrl('https://example.com/path')).toBe(true);
        expect(validateUrl('https://example.com/path?v=4')).toBe(true);
    });

    test('invalid URLs fail validation', () => {
        expect(validateUrl('')).toBe(false);
        expect(validateUrl('invalid-url')).toBe(false);
        expect(validateUrl('ftp://example.com')).toBe(false); // Not supported by regex
    });
});


describe('validateShortUrlKey', () => {

    test('returns false for keys shorter than 6 characters', () => {
        expect(validateShortUrlKey('abc')).toBe(false);
        expect(validateShortUrlKey('123')).toBe(false);
        expect(validateShortUrlKey('aB1')).toBe(false);
    });

    test('returns true for valid Base62 keys with 6 or more characters', () => {
        expect(validateShortUrlKey('aB12cD')).toBe(true); // Mixed case
        expect(validateShortUrlKey('123456')).toBe(true); // Only numbers
        expect(validateShortUrlKey('abcdef')).toBe(true); // Only lowercase
        expect(validateShortUrlKey('ABCDEF')).toBe(true); // Only uppercase
    });

    test('returns false for keys with invalid characters', () => {
        expect(validateShortUrlKey('aB12cD$')).toBe(false); // Contains `$`
        expect(validateShortUrlKey('aB1 2cD')).toBe(false); // Contains space
        expect(validateShortUrlKey('aB12cD!')).toBe(false); // Contains `!`
    });

    test('returns true for keys exactly 6 characters long', () => {
        expect(validateShortUrlKey('aBc123')).toBe(true);
    });

    test('returns true for keys longer than 6 characters and valid', () => {
        expect(validateShortUrlKey('aB12345')).toBe(true);
    });

    test('returns false for empty string', () => {
        expect(validateShortUrlKey('')).toBe(false);
    });

});

