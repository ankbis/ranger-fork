class Calculator {
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Invalid input: arguments must be numbers');
    }
    return a + b;
  }

  subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Invalid input: arguments must be numbers');
    }
    return a - b;
  }

  sqrt(a) {
    if (typeof a !== 'number') {
      throw new Error('Invalid input: argument must be a number');
    }
    if (a < 0) {
      throw new Error('Invalid input: argument must be non-negative');
    }
    return Math.sqrt(a);
  }
}

module.exports = Calculator;
