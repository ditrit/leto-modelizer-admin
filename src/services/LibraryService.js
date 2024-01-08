import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get all libraries.
 * @returns {Promise<object[]>} Promise with an array of libraries on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/api/classes/Library', { headers: getDefaultHeaders() })
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

/**
 * Create library.
 * @param {string} url - Url of the library.
 * @param {string} roleName - Name of the library role.
 * @returns {Promise<object>} Promise with library object on success otherwise an error.
 */
export async function create(url, roleName) {
  return api.post('/api/classes/Library', { url, roleName }, { headers: getDefaultHeaders() })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Synchronize library url.
 * @param {string} id - Library id.
 * @param {string} url - Url of the library.
 * @returns {Promise<object>} Promise with library object on success otherwise an error.
 */
export async function synchronize(id, url) {
  return api.put(`/api/classes/Library/${id}`, { url }, { headers: getDefaultHeaders() })
    .then(({ data }) => data)
    .catch(manageError);
}
