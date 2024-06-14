const assert = require('assert');
const { parse, isValidJSON, getType } = require('../src/json-parser');

describe('JSON Parser', () => {
  describe('parse', () => {
    it('should parse a valid JSON string', () => {
      const jsonString = '{"name":"John","age":30,"city":"New York"}';
      const expected = { name: 'John', age: 30, city: 'New York' };
      assert.deepStrictEqual(parse(jsonString), expected);
    });

    it('should throw an error for an invalid JSON string', () => {
      const jsonString = '{"name":"John","age":30,"city":"New York}';
      assert.throws(() => parse(jsonString), Error, 'Invalid JSON string');
    });
  });

  describe('isValidJSON', () => {
    it('should return true for a valid JSON string', () => {
      const jsonString = '{"name":"John","age":30,"city":"New York"}';
      assert.strictEqual(isValidJSON(jsonString), true);
    });

    it('should return false for an invalid JSON string', () => {
      const jsonString = '{"name":"John","age":30,"city":"New York}';
      assert.strictEqual(isValidJSON(jsonString), false);
    });
  });

  describe('getType', () => {
    it('should return the correct JSON data type', () => {
      assert.strictEqual(getType(42), 'number');
      assert.strictEqual(getType('hello'), 'string');
      assert.strictEqual(getType(true), 'boolean');
      assert.strictEqual(getType(null), 'null');
      assert.strictEqual(getType({}), 'object');
      assert.strictEqual(getType([]), 'array');
    });
  });
});

