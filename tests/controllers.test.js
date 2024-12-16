const request = require('supertest');
const app = require('../app');

describe('URL Shortener API', () => {
    test('POST /shorten returns a short URL for a valid long URL', async () => {
        const response = await request(app)
            .post('/shorten')
            .send({ longUrl: 'http://example.com' });

        expect(response.status).toBe(200);
        expect(response.body.shortUrl).toMatch(/^http:\/\/localhost:3000\/[a-zA-Z0-9]+$/);
    });

    test('GET /:shortUrl redirects to the original URL', async () => {
        const { body } = await request(app)
            .post('/shorten')
            .send({ longUrl: 'http://example.com' });

        const shortUrlKey = body.shortUrl.replace('http://localhost:3000/', '');

        const response = await request(app).get(`/${shortUrlKey}`);
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('http://example.com');
    });

    test('GET /:shortUrl returns 404 for invalid short URL', async () => {
        const response = await request(app).get('/invalidKey');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Short URL not available.');
    });
});
