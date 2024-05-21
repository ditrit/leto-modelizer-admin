import Filter from 'src/composables/filters/Filter';

/**
 * Class representing a string filter.
 * @augments Filter
 */
class StringFilter extends Filter {
  /**
   * Default constructor.
   * @param {string} filterName - The name of the filter.
   * @param {string} serverName - The name used for the filter on the server.
   * @param {string} queryName - The name used for the filter in query parameters.
   * @param {string} defaultValue - The default value of the filter.
   */
  constructor(filterName, serverName, queryName, defaultValue = '') {
    super(filterName, serverName, queryName, defaultValue);
  }

  /**
   * Get the value of the filter formatted with 'lk_*' and '*' around the value.
   * @param {string} value - The value to format.
   * @returns {string} The formatted value of the filter.
   */
  getFilterValue(value) {
    return `lk_*${value}*`;
  }
}

export default StringFilter;
