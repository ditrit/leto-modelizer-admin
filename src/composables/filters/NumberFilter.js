import Filter from 'src/composables/filters/Filter';

/**
 * Class representing a number filter.
 * @augments Filter
 */
class NumberFilter extends Filter {
  /**
   * Default constructor.
   * @param {string} filterName - The name of the filter.
   * @param {string} serverName - The name used for the filter on the server.
   * @param {string} queryName - The name used for the filter in query parameters.
   * @param {number} defaultValue - The default value of the filter.
   */
  constructor(filterName, serverName, queryName, defaultValue = 0) {
    super(filterName, serverName, queryName, defaultValue);
  }

  /**
   * Get the value of the filter from the URL and parse it as an integer.
   * @param {string} value - The value from the URL.
   * @returns {number} The parsed integer value of the filter.
   */
  getValueFromUrl(value) {
    return parseInt(value, 10) || this.defaultValue;
  }
}

export default NumberFilter;
