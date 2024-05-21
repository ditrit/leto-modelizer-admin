/**
 * Class representing a filter.
 */

class Filter {
  /**
   * Default constructor.
   * @param {string} filterName - The name of the filter.
   * @param {string} serverName - The name used for the filter on the server.
   * @param {string} queryName - The name used for the filter in query parameters.
   * @param {*} defaultValue - The default value of the filter.
   */
  constructor(filterName, serverName, queryName, defaultValue) {
    /**
     * Name of the filter.
     * @type {string}
     */
    this.filterName = filterName;

    /**
     * Name used for the filter on the server.
     * @type {string}
     */
    this.serverName = serverName;

    /**
     * Name used for the filter in query parameters.
     * @type {string}
     */
    this.queryName = queryName;

    /**
     * Default value of the filter.
     * @type {*}
     */
    this.defaultValue = defaultValue;
  }

  /**
   * Get the value of the filter.
   * @param {*} value - The value to get.
   * @returns {*} The value of the filter.
   */
  getFilterValue(value) {
    return value;
  }

  /**
   * Get the value of the filter from the URL.
   * @param {*} value - The value from the URL.
   * @returns {*} The value of the filter.
   */
  getValueFromUrl(value) {
    return value;
  }

  /**
   * Check if the value is the default value.
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is the default value, false otherwise.
   */
  isDefaultValue(value) {
    return value?.length === 0 || !value;
  }
}

export default Filter;
