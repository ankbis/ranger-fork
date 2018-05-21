(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.ranger = factory());
}(this, (function () { 'use strict';

  /**
   * @namespace
   */
  const ranger = {

    /**
     * Default curve, which is just a pass-through function.
     *
     * @param {number} x
     * @returns {number}
     */
    LINEAR: x => x,

    // measurements

    /**
     * Calculates the length of a range, or just (max - min). Used internally.
     * No validation is performed to check if the range is valid (max >= min).
     *
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @returns {number} Length of the range.
     */
    length(min, max) {
      return max - min;
    },

    /**
     * A range is valid if max >= min.
     *
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @returns {boolean}
     */
    isValid(min, max) {
      return max >= min;
    },

    /**
     * Returns the position of a value in the range, as a float 0.0 and 1.0.
     * The supplied value is not clamped. If it's out of bounds, the returned position will be proportionally out of bounds.
     *
     * @param {number} x - The value to check.
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @param {function} [curve] - The curve function to apply.
     * @returns {number} - Position of the supplied value.
     */
    getPosition(x, min, max, curve = ranger.LINEAR) {
      return curve((x - min) / ranger.length(min, max));
    },

    /**
     * Returns the value at a given position in the rage.
     * The returned value is not clamped.
     *
     * @param {number} x - The position to check. Should be between 0.0 and 1.0.
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @param {function} [curve] - The curve function to apply.
     * @returns {*} - Value at the supplied position.
     */
    getValue(x, min, max, curve = ranger.LINEAR) {
      return min + curve(x) * ranger.length(min, max);
    },

    // mapping

    /**
     * Maps a value from one range to a value from another range at the same position.
     * The source range is sampled linearly.
     * None of the values are clamped.
     *
     * @param {number} x - The value to map. Should be contained in sourceRange.
     * @param {Range} sourceRange - The range to map from.
     * @param {Range} targetRange - The range to map to.
     * @param {function} [curve] - The curve function to apply to the targetRange.
     * @returns {Number} - The mapped value, between targetRange.min and targetRange.max.
     */
    map(x, sourceRange, targetRange, curve = ranger.LINEAR) {
      return ranger.getValue(sourceRange.getPosition(x, ranger.LINEAR), targetRange.min, targetRange.max, curve);
    },

    /**
     * Same as map, but the source and target ranges should be provided as numbers.
     *
     * @see map
     *
     * @param {number} x - The value to map. Should be contained in the source range.
     * @param {number} sourceMin - Min value for the source range.
     * @param {number} sourceMax - Max value for the source range.
     * @param {number} targetMin - Min value for the target range.
     * @param {number} targetMax - Max value for the target range.
     * @param {function} [curve] - The curve function to apply to the target range.
     * @returns {number} - The mapped value, between targetMin and targetMax.
     */
    mapFloat(x, sourceMin, sourceMax, targetMin, targetMax, curve = ranger.LINEAR) {
      return ranger.getValue(ranger.getPosition(x, sourceMin, sourceMax, ranger.LINEAR), targetMin, targetMax, curve);
    },

    // random

    /**
     * Returns a random float between min and max.
     *
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @param {function} [curve] - The curve function to apply.
     * @returns {number}
     */
    random(min, max, curve = ranger.LINEAR) {
      return min + curve(Math.random()) * ranger.length(min, max);
    },

    /**
     * Returns a random int between min and max.
     * The returned value is floored, so it will never equal max.
     *
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @param {function} [curve] - The curve function to apply.
     * @returns {number}
     */
    randomInt(min, max, curve = ranger.LINEAR) {
      return ranger.random(min, max, curve) | 0;
    },

    // common operations

    /**
     * Returns min if x < min.
     * Returns max if x > max.
     * Returns x otherwise.
     *
     * @param {number} x - The value to check.
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @returns {number} - The clamped value.
     */
    clamp(x, min, max) {
      return x < min ? min : x > max ? max : x;
    },

    /**
     * Wraps a value around the range.
     * This is similar to the modulo operator, but for arbitrary ranges.
     *
     * @param {number} x - The value to wrap.
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @returns {number} - The wrapped value.
     */
    wrap(x, min, max) {
      const l = ranger.length(min, max);

      return (((x - min) % l) + l) % l + min;
    },

    /**
     * Checks if a value is inside the range.
     *
     * @param {number} x - The value to check.
     * @param {number} min - Min value of the range.
     * @param {number} max - Max value of the range.
     * @returns {boolean}
     */
    contains(x, min, max) {
      return x >= min && x <= max;
    },

    /**
     * Checks if the source range is contained in the target range.
     *
     * @param {Range} sourceRange - The range to check.
     * @param {Range} targetRange - The range the sourceRange will be compared to.
     * @returns {boolean}
     */
    containsRange(sourceRange, targetRange) {
      return ranger.contains(sourceRange.min, targetRange.min, targetRange.max) && ranger.contains(sourceRange.max, targetRange.min, targetRange.max);
    },
  };

  /**
   * Creates a new Range instance with a min, max, and curve for repeated use.
   * No validation is performed to check if min is less or equal to max.
   *
   * @class
   * @constructor
   */
  class Range {
    /**
     * Creates a new Range instance with a min, max, and curve for repeated use.
     * No validation is performed to check if min is less or equal to max.
     *
     * @param {number} min - Min value for this range.
     * @param {number} max - Max value for this range.
     * @param {function} [curve] - The curve function to apply by default.
     */
    constructor(min = 0, max = 0, curve = ranger.LINEAR) {
      /**
       * Min value for this range
       * @type {number}
       */
      this.min = min;
      /**
       * Max value for this range
       * @type {number}
       */
      this.max = max;
      /**
       * The curve used by this range.
       * This should be a function that takes a number (0.0 to 1.0), and returns a transformed number.
       * @type {Function}
       */
      this.curve = curve;
    }

    /**
     * Sets this range min and max based on a size and a center.
     * Min will be set to size * -0.5 + center.
     * Max will be set to size * 0.5 + center.
     *
     * @param {Number} size - The total size of the range.
     * @param {Number} [center=0] - The center of the range. Defaults to 0.
     * @param {function} [curve] - The curve function to apply by default.
     * @returns {Range}
     */
    fromSizeAndCenter(size, center = 0, curve = this.curve) {
      this.min = size * -0.5 + center;
      this.max = size * 0.5 + center;
      this.curve = curve;

      return this;
    }

    /**
     * Sets the min, max, and curve for this range.
     *
     * @param {number} min - Min value for this range.
     * @param {number} max - Max value for this range.
     * @param {function} [curve] - The curve function to apply by default.
     * @returns {Range}
     */
    set(min = this.min, max = this.max, curve = this.curve) {
      this.min = min;
      this.max = max;
      this.curve = curve;

      return this;
    }

    /**
     * Sets the min value for this range. This method mostly exists for chaining.
     *
     * @param {number} min - Min value for this range.
     * @returns {Range}
     */
    setMin(min) {
      this.min = min;

      return this;
    }

    /**
     * Sets the max value for this range. This method mostly exists for chaining.
     *
     * @param {number} max - Max value for this range.
     * @returns {Range}
     */
    setMax(max) {
      this.max = max;

      return this;
    }

    /**
     * Sets the default curve for this range. This method mostly exists for chaining.
     *
     * @param {function} curve - The curve function to apply by default.
     * @returns {Range}
     */
    setCurve(curve) {
      this.curve = curve;

      return this;
    }

    /**
     * Multiplies this range's min and max with the given scalar.
     * Values below 1.0 will make the range smaller.
     * Values over 1.0 will make it bigger.
     *
     * @param {number} s - The scalar to use.
     * @returns {Range}
     */
    scale(s) {
      this.min *= s;
      this.max *= s;

      return this;
    }

    /**
     * Expands this range by a given delta.
     * The delta is subtracted from this.min, and added to this.max.
     *
     * @param {Number} d - The delta to expand this range by.
     * @returns {Range}
     */
    expand(d) {
      this.min -= d;
      this.max += d;

      return this;
    }

    /**
     * Contracts this range by a given delta.
     * The delta is added to this.min, and subtracted from this.max.
     *
     * @param {number} d - The delta to contract this range by.
     * @returns {Range}
     */
    contract(d) {
      this.min += d;
      this.max -= d;

      return this;
    }

    /**
     * Shifts this range by a given delta.
     * The delta is added to this.min and this.max.
     *
     * @param {number} d - The delta to shift this range by.
     * @returns {Range}
     */
    shift(d) {
      this.min += d;
      this.max += d;

      return this;
    }

    /**
     * Copies another range's min, max, and curve into this one.
     * The curve is passed by reference.
     *
     * @param {Range} range - The range to copy from.
     * @returns {Range}
     */
    copy(range) {
      this.min = range.min;
      this.max = range.max;
      this.curve = range.curve;

      return this;
    }

    /**
     * Creates a shallow copy of this range.
     *
     * @returns {Range}
     */
    clone() {
      return new Range(this.min, this.max, this.curve);
    }

    /**
     * Checks if this range is empty.
     * A range is empty if its min === max.
     *
     * @returns {boolean}
     */
    isEmpty() {
      return this.min === this.max;
    }

    /**
     * Sets this range's min and max to 0.
     *
     * @returns {Range}
     */
    makeEmpty() {
      this.min = 0;
      this.max = 0;

      return this;
    }

    /**
     * @see ranger.length
     * @returns {number}
     */
    length() {
      return ranger.length(this.min, this.max);
    }

    /**
     * @see ranger.getPosition
     *
     * @param {number} x - The value to check.
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {number}
     */
    getPosition(x, curve = this.curve) {
      return ranger.getPosition(x, this.min, this.max, curve)
    }

    /**
     * @see ranger.getValue
     *
     * @param {number} x - The position to check. Should be between 0.0 and 1.0.
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {number}
     */
    getValue(x, curve = this.curve) {
      return ranger.getValue(x, this.min, this.max, curve);
    }

    /**
     * @see ranger.map
     *
     * @param {number} x - The value to map. Should be contained in sourceRange.
     * @param {Range} range - The range to map from.
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {Number}
     */
    map(x, range, curve = this.curve) {
      return ranger.map(x, range, this, curve);
    }

    /**
     * @see ranger.mapFloat
     *
     * @param {number} x - The value to map. Should be contained in the source range.
     * @param {number} min - Min value for the source range.
     * @param {number} max - Max value for the source range.
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {number}
     */
    mapFloat(x, min, max, curve = this.curve) {
      return ranger.mapFloat(x, min, max, this.min, this.max, curve);
    }

    /**
     * @see ranger.random
     *
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {number}
     */
    random(curve = this.curve) {
      return ranger.random(this.min, this.max, curve);
    }

    /**
     * @see ranger.randomInt
     *
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {number}
     */
    randomInt(curve = this.curve) {
      return ranger.randomInt(this.min, this.max, curve);
    }

    /**
     * Creates an array of values spread inside this range.
     * Values are inclusive, ie values[0] === this.min, and values[values.length - 1] === this.max.
     *
     * @param {number} count - Number of values (slices) to create. Should be >= 2.
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {number[]}
     */
    slice(count, curve = this.curve) {
      if (count < 2) return [this.min, this.max];

      const values = [];

      for (let i = 0; i < count; i++) {
        values[i] = this.getValue(i / (count - 1), curve);
      }

      return values;
    }

    /**
     * Divides this range into a number of smaller ranges.
     * Each range will copy this range's curve.
     *
     * todo: add support for margin and padding.
     *
     * @param {number} count - The number of sub-ranges to create.
     * @param {function} [curve] - The curve function to apply. Overrides the default set for this range.
     * @returns {Range[]}
     */
    divide(count, curve = this.curve) {
      if (count <= 1) return [this.clone()];

      const ranges = [];

      for (let i = 0; i < count; i++) {
        const min = this.getValue(i / count);
        const max = this.getValue((i + 1) / count);

        ranges[i] = new Range(min, max, this.curve);
      }

      return ranges;
    }

    /**
     * @see ranger.clamp
     *
     * @param {number} x - The value to check.
     * @returns {number}
     */
    clamp(x) {
      return ranger.clamp(x, this.min, this.max);
    }

    /**
     * @see ranger.wrap
     *
     * @param {number} x - The value to wrap.
     * @returns {number}
     */
    wrap(x) {
      return ranger.wrap(x, this.min, this.max);
    }

    /**
     * @see ranger.contains
     *
     * @param {number} x - The value to check.
     * @returns {boolean}
     */
    contains(x) {
      return ranger.contains(x, this.min, this.max);
    }

    /**
     * @see ranger.containsRange
     *
     * @param {Range} range - The range to check.
     * @returns {boolean}
     */
    containsRange(range) {
      return ranger.containsRange(range, this);
    }
  }

  ranger.Range = Range;

  return ranger;

})));
