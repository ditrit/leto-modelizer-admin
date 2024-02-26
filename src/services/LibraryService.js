import { prepareRequest } from 'boot/axios';

/**
 * Get all libraries.
 * @returns {Promise<object[]>} Promise with an array of libraries on success
 * otherwise an error.
 */
export async function find() {
  const api = await prepareRequest();

  return api.get('/libraries').then(({ data }) => data);
}

/**
 * Get library by id.
 * @param {string} id - Library id.
 * @returns {Promise<object>} Return a library.
 */
export async function findById(id) {
  const api = await prepareRequest();

  return api.get(`/libraries/${id}`).then(({ data }) => data);
}

/**
 * Remove library by id.
 * @param {string} id - Library id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  const api = await prepareRequest();

  return api.delete(`/libraries/${id}`);
}

/**
 * Create library.
 * @param {string} url - Url of the library.
 * @param {string} role - Name of the library role.
 * @returns {Promise<object>} Promise with library object on success otherwise an error.
 */
export async function create(url, role) {
  const api = await prepareRequest();

  return api.post('/libraries', { url, role }).then(({ data }) => data);
}

/**
 * Synchronize library url.
 * @param {string} id - Library id.
 * @param {string} url - Url of the library.
 * @returns {Promise<object>} Promise with library object on success otherwise an error.
 */
export async function synchronize(id, url) {
  const api = await prepareRequest();

  return api.put(`/libraries/${id}`, { url }).then(({ data }) => data);
}
