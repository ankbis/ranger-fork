import request from 'supertest';
import app from '../src/app';

describe('RateLimiter Integration', () => {
  test('should limit requests within time window', async () => {
    const maxRequests = 3;
    const windowMs = 1000;
    app.rateLimiter = new RateLimiter({ maxRequests, windowMs });

    for (let i = 0; i < maxRequests; i++) {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
    }

    const res = await request(app).get('/');
    expect(res.statusCode).toBe(429);
    expect(res.text).toBe('Too Many Requests');
  });

  test('should reset rate limit after time window', async () => {
    const maxRequests = 3;
    const windowMs = 1000;
    app.rateLimiter = new RateLimiter({ maxRequests, windowMs });

    for (let i = 0; i < maxRequests; i++) {
      await request(app).get('/');
    }

    await new Promise(resolve => setTimeout(resolve, windowMs + 100));

    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});

