import { performance } from 'perf_hooks';

class RateLimiter {
  constructor(options) {
    this.maxRequests = options.maxRequests || 100;
    this.windowMs = options.windowMs || 60000;
    this.requestCounts = new Map();
    this.resetTimers = new Map();
  }

  middleware(req, res, next) {
    const key = req.ip;
    const currentTime = performance.now();

    if (this.isRateLimitExceeded(key, currentTime)) {
      this.sendRateLimitExceededResponse(res);
      return;
    }

    this.incrementRequestCount(key, currentTime);
    next();
  }

  incrementRequestCount(key, currentTime) {
    const count = this.requestCounts.get(key) || { count: 0, lastResetTime: currentTime };
    count.count++;
    this.requestCounts.set(key, count);

    if (!this.resetTimers.has(key)) {
      this.resetTimers.set(key, setTimeout(() => {
        this.requestCounts.set(key, { count: 0, lastResetTime: currentTime + this.windowMs });
        this.resetTimers.delete(key);
      }, this.windowMs));
    }
  }

  isRateLimitExceeded(key, currentTime) {
    const count = this.requestCounts.get(key);
    if (!count) return false;

    const elapsed = currentTime - count.lastResetTime;
    if (elapsed >= this.windowMs) {
      this.requestCounts.set(key, { count: 1, lastResetTime: currentTime });
      return false;
    }

    return count.count > this.maxRequests;
  }

  sendRateLimitExceededResponse(res) {
    res.status(429).send('Too Many Requests');
  }
}

export default RateLimiter;

