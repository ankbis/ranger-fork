/**
 * Parses a JSON string and returns a JavaScript object.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {Object} The parsed JavaScript object.
 * @throws {Error} If the input is not a valid JSON string.
 */
function parse(jsonString) {
  if (!isValidJSON(jsonString)) {
    throw new Error('Invalid JSON string');
  }

  return JSON.parse(jsonString);
}

/**
 * Checks if a given string is a valid JSON string.
 * @param {string} input - The string to check.
 * @returns {boolean} True if the input is a valid JSON string, false otherwise.
 */
function isValidJSON(input) {
  try {
    JSON.parse(input);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Returns the JSON data type of a given value.
 * @param {any} value - The value to get the type for.
 * @returns {string} The JSON data type of the value.
 */
function getType(value) {
  const type = typeof value;
  if (type === 'object') {
    if (value === null) {
      return 'null';
    } else if (Array.isArray(value)) {
      return 'array';
    } else {
      return 'object';
    }
  }
  return type;
}

module.exports = {
  parse,
  isValidJSON,
  getType,
};

