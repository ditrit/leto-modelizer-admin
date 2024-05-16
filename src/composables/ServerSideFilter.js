import {
  ref,
} from 'vue';

/**
 * Composable that provides all values for server side filter and pagination.
 * @param {Array} filterDefinition - Array containing filter object definition.
 * @returns {object} Object containing filters value and related methods.
 */
export function useServerSideFilter(filterDefinition) {
  const filterOptions = {};

  const filters = ref(filterDefinition.reduce((acc, value) => {
    filterOptions[value.filterName] = value;

    acc[value.filterName] = value.defaultValue;

    return acc;
  }, {}));

  /**
   * Create API filters.
   * @returns {object} Object that contains filters.
   */
  function getFilters() {
    return Object.keys(filters.value).reduce((obj, key) => {
      const value = filterOptions[key]?.getFilterValue(filters.value[key]);

      if (filters.value[key] && value) {
        obj[filterOptions[key].serverName] = value.toString();
      }

      return obj;
    }, {});
  }

  /**
   * Init filters and pagination from query parameters in url.
   * @param {object} query - URL query parameters object.
   */
  function init(query = {}) {
    Object.keys(filters.value).forEach((key) => {
      const queryKey = filterOptions[key].queryName;
      const value = filterOptions[key]?.getValueFromUrl(query[queryKey]);

      if (value) {
        filters.value[key] = value;
      }
    });
  }

  /**
   * Generate query parameters with filters value.
   * @returns {object} Query parameters object.
   */
  function generateQuery() {
    const queryParameters = {};

    Object.keys(filters.value).forEach((key) => {
      const queryKey = filterOptions[key].queryName;
      const isDefaultValue = filterOptions[key]?.isDefaultValue(filters.value[key]);

      if (!isDefaultValue) {
        queryParameters[queryKey] = filters.value[key];
      }
    });

    return queryParameters;
  }

  return {
    filters,
    init,
    getFilters,
    generateQuery,
  };
}
