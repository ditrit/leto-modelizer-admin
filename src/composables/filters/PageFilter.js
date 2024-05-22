import NumberFilter from 'src/composables/filters/NumberFilter';

/**
 * Class representing a page filter.
 * @augments NumberFilter
 */
class PageFilter extends NumberFilter {
  /**
   * Default constructor.
   */
  constructor() {
    super('page', 'page', 'page', 0);
  }

  /**
   * Get the value of the filter, adjusted for page indexing.
   * Pages are assumed to be 1-indexed and are converted to 0-indexed.
   * @param {number} value - The value to format.
   * @returns {number|null} The formatted value of the filter or null if invalid.
   */
  getFilterValue(value) {
    return value >= 1 ? value - 1 : null;
  }

  /**
   * Check if the value is the default value.
   * A value of 0 or 1 is considered the default for pages.
   * @param {number} value - The value to check.
   * @returns {boolean} True if the value is the default value, false otherwise.
   */
  isDefaultValue(value) {
    return value <= 1;
  }
}

export default PageFilter;
