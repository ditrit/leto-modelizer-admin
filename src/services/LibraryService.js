import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get all libraries.
 * @returns {Promise<object[]>} Promise with an array of libraries on success
 * otherwise an error.
 */
export async function find() {
  const queryParameters = 'limit=10';

  return api.get(`/api/classes/Library?${queryParameters}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data.results)
    .catch(manageError);
}

/**
 * Get library by id.
 * @param {string} id - Library id.
 * @returns {Promise<object>} Return a library.
 */
export async function findById(id) {
  return api.get(`/api/classes/Library/${id}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Remove library by id.
 * @param {string} id - Library id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/api/classes/Library/${id}`, { headers: getDefaultHeaders() })
    .catch(manageError);
}
