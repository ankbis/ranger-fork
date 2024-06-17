const assert = require('assert');
const ranger = require('../');
const { Range } = require('../');
const RateLimiterCache = require('../src/RateLimiterCache');

console.log('TESTING RANGER');

assert.equal(ranger.length(10, 20), 10);

const range1 = new Range(0, 1);

assert.equal(range1.isEmpty(), false);

range1.makeEmpty();

assert.equal(range1.isEmpty(), true);

range1.set(20, 40);

assert.equal(range1.length(), 20);

range1.fromSizeAndCenter(40);

assert.equal(range1.length(), 40);
assert.equal(range1.min, -20);
assert.equal(range1.max, 20);

range1.fromSizeAndCenter(40, 40);

assert.equal(range1.length(), 40);
assert.equal(range1.min, 20);
assert.equal(range1.max, 60);

range1.set(10, 20).scale(0.5);

assert.equal(range1.length(), 5);
assert.equal(range1.min, 5);
assert.equal(range1.max, 10);

range1.set(6, 12).shift(-6);

assert.equal(range1.length(), 6);
assert.equal(range1.min, 0);
assert.equal(range1.max, 6);

range1.set(6, 12).expand(6);

assert.equal(range1.length(), 18);
assert.equal(range1.min, 0);
assert.equal(range1.max, 18);

range1.set(6, 12).contract(2);

assert.equal(range1.length(), 2);
assert.equal(range1.min, 8);
assert.equal(range1.max, 10);

range1.set(10, 20);

assert.equal(range1.getValue(0.5), 15);
assert.equal(range1.getValue(0), 10);
assert.equal(range1.getPosition(15), 0.5);
assert.equal(range1.getPosition(10), 0);

range1.set(0, 100);

assert.equal(range1.map(0.1, new Range(0, 1)), 10);
assert.equal(range1.map(0.9, new Range(0, 1)), 90);
assert.equal(range1.mapFloat(0.5, 0, 1), 50);
assert.equal(range1.mapFloat(32, 0, 64), 50);

range1.set(-10, 10);

assert.equal(range1.contains(0), true);
assert.equal(range1.contains(-11), false);
assert.equal(range1.contains(11), false);
assert.equal(range1.contains(10), true);

assert.equal(range1.containsRange(new Range(-5, 5)), true);
assert.equal(range1.containsRange(new Range(-11, 5)), false);
assert.equal(range1.containsRange(new Range(-5, 11)), false);

// Test RateLimiterCache
const cache = new RateLimiterCache();
cache.set('key1', 'value1', 1);
assert.equal(await cache.get('key1'), 'value1');
setTimeout(async () => {
  assert.equal(await cache.get('key1'), null);
}, 1500);
cache.delete('key2');
assert.equal(await cache.get('key2'), null);
cache.clear();
assert.equal(await cache.get('key1'), null);

// Test caching of rate limiting functions
const result1 = await ranger.getPosition(10, 0, 100);
const result2 = await ranger.getPosition(10, 0, 100);
assert.strictEqual(result1, result2); // Cached result should be the same

const result3 = await ranger.random(0, 100);
const result4 = await ranger.random(0, 100);
assert.notStrictEqual(result3, result4); // Random values should be different

console.log('TEST COMPLETE!');
