import redis from 'redis';

class RateLimiterCache {
  constructor() {
    this.client = redis.createClient();
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }

  set(key, value, ttl) {
    this.client.setex(key, ttl, value);
  }

  delete(key) {
    this.client.del(key);
  }

  clear() {
    this.client.flushall();
  }
}

export default RateLimiterCache;
