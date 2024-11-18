import {
  prepareQueryParameters,
  prepareRequest,
  makeFilterRequest,
} from 'boot/axios';

/**
 * Get all configurations paginated.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Promise with an array of configurations on success
 * otherwise an error.
 */
export async function find(filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/ai/configurations${queryParameters}`)
    .then(({ data }) => data);
}

/**
 * Get all configurations without pagination.
 * Recursive function to get all configurations from `find`.
 * @param {object} filters - API filters.
 * @param {Array} configurations - Pagination result to set.
 * @returns {Promise<object[]>} Promise with an array of configurations on success
 * otherwise an error.
 */
export async function findAll(filters = {}, configurations = []) {
  return find(filters)
    .then((data) => {
      const nextPage = data.pageable.pageNumber + 1;
      data.content.forEach((item) => configurations.push(item));

      if (data.totalPages <= nextPage) {
        return Promise.resolve(configurations);
      }

      return findAll({
        ...filters,
        page: `${nextPage}`,
      }, configurations);
    });
}

/**
 * Get all configuration field descriptions.
 * @returns {Promise<object[]>} Promise with an array of configuration field descriptions on success
 * otherwise an error.
 */
export async function findDescriptionFields() {
  const api = await prepareRequest();

  return api.get('/ai/proxy/descriptions')
    .then(({ data }) => data);
}

/**
 * Create a new configuration.
 * @param {object} configuration - Configuration to create.
 * @returns {Promise<object>} Promise with new created configuration on success otherwise an error.
 */
export async function add(configuration) {
  const api = await prepareRequest();

  return api.post('/ai/configurations', configuration)
    .then(({ data }) => data);
}

/**
 * Delete configuration by id.
 * @param {string} id - Id of configuration.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function deleteById(id) {
  const api = await prepareRequest();

  return api.delete(`/ai/configurations/${id}`)
    .then(({ data }) => data);
}

/**
 * Update multiple configurations.
 * @param {Array<object>} configurations - Configurations to update.
 * @returns {Promise<*>} Promise with updated configurations on success otherwise an error.
 */
export async function updateAll(configurations) {
  const api = await prepareRequest();

  return api.put('/ai/configurations', configurations)
    .then(({ data }) => data);
}
