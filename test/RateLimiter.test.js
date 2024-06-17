import RateLimiter from '../src/middleware/RateLimiter';

describe('RateLimiter', () => {
  let rateLimiter;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(() => {
    rateLimiter = new RateLimiter({ maxRequests: 3, windowMs: 1000 });
    jest.clearAllMocks();
  });

  test('should increment request count', () => {
    const key = '127.0.0.1';
    rateLimiter.incrementRequestCount(key, performance.now());
    expect(rateLimiter.requestCounts.get(key).count).toBe(1);
  });

  test('should not exceed rate limit', () => {
    const key = '127.0.0.1';
    for (let i = 0; i < 3; i++) {
      rateLimiter.incrementRequestCount(key, performance.now());
    }
    expect(rateLimiter.isRateLimitExceeded(key, performance.now())).toBe(false);
  });

  test('should exceed rate limit', () => {
    const key = '127.0.0.1';
    for (let i = 0; i < 4; i++) {
      rateLimiter.incrementRequestCount(key, performance.now());
    }
    expect(rateLimiter.isRateLimitExceeded(key, performance.now())).toBe(true);
  });

  test('should send rate limit exceeded response', () => {
    rateLimiter.sendRateLimitExceededResponse(mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(429);
    expect(mockRes.send).toHaveBeenCalledWith('Too Many Requests');
  });
});

