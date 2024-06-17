import ranger from '../src/ranger';

describe('Rate Limiter Logging and Monitoring', () => {
  it('should log rate limit violations', () => {
    const logSpy = jest.spyOn(console, 'log');
    const endpoint = '/api/users';
    const userId = 'user123';
    const timestamp = Date.now();

    ranger.logRateLimitViolation(endpoint, userId, timestamp);

    expect(logSpy).toHaveBeenCalledWith(`Rate limit violation: ${endpoint} by ${userId} at ${timestamp}`);
    logSpy.mockRestore();
  });

  it('should update rate limiter performance metrics', () => {
    ranger.metrics.updateHitRate(10);
    ranger.metrics.updateMissRate(5);
    ranger.metrics.updateCacheHitRate(8);

    const metrics = ranger.metrics.getRateLimiterMetrics();

    expect(metrics.hitRate).toBe(10 / 15);
    expect(metrics.missRate).toBe(5 / 15);
    expect(metrics.cacheHitRate).toBe(8 / 15);
  });

  it('should retrieve rate limiter metrics', () => {
    const metrics = ranger.metrics.getRateLimiterMetrics();

    expect(metrics).toHaveProperty('hitRate');
    expect(metrics).toHaveProperty('missRate');
    expect(metrics).toHaveProperty('cacheHitRate');
  });

  it('should handle division by zero', () => {
    const metrics = ranger.metrics.getRateLimiterMetrics();

    expect(metrics.hitRate).toBe(0);
    expect(metrics.missRate).toBe(0);
    expect(metrics.cacheHitRate).toBe(0);
  });
});
