import {
  prepareQueryParameters,
  prepareRequest,
  makeFilterRequest,
} from 'boot/axios';

/**
 * Get all secrets.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Promise with an array of secrets on success
 * otherwise an error.
 */
export async function find(filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/ai/secrets${queryParameters}`).then(({ data }) => data);
}

/**
 * Remove secret by id.
 * @param {string} id - User id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  const api = await prepareRequest();

  return api.delete(`/ai/secrets/${id}`);
}

/**
 * Add secret.
 * @param {string} key - Secret key.
 * @param {string} value - Secret value.
 * @returns {Promise<object>} Promise with created Secret on success.
 */
export async function add(key, value) {
  const api = await prepareRequest();

  return api.post('/ai/secrets', { key, value }).then(({ data }) => data);
}

/**
 * Update secret by id.
 * @param {string} id - Secret id.
 * @param {string} key - Secret key.
 * @param {string} value - Secret value.
 * @returns {Promise<object>} Promise with updated Secret on success.
 */
export async function update(id, key, value) {
  const api = await prepareRequest();

  return api.put(`/ai/secrets/${id}`, { key, value }).then(({ data }) => data);
}
