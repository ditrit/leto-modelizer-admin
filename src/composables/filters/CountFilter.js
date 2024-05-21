import NumberFilter from 'src/composables/filters/NumberFilter';

/**
 * Class representing a count filter.
 * @augments NumberFilter
 */
class CountFilter extends NumberFilter {
  /**
   * Default constructor.
   */
  constructor() {
    super('count', 'count', 'size', 10);
  }

  /**
   * Get the value of the filter. If the value is the default (10), return null.
   * @param {number} value - The value to format.
   * @returns {number|null} The formatted value of the filter or null if it is the default.
   */
  getFilterValue(value) {
    return value !== 10 ? value : null;
  }

  /**
   * Check if the value is the default value.
   * @param {number} value - The value to check.
   * @returns {boolean} True if the value is the default value, false otherwise.
   */
  isDefaultValue(value) {
    return value === 10;
  }
}

export default CountFilter;
