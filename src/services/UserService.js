import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get information about the current user.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<object>} Promise with the logged-in user information on success
 * otherwise an error.
 */
export async function findCurrent(sessionToken) {
  return api.get('/api/users/me', { headers: getDefaultHeaders(sessionToken) })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Get all users.
 * @returns {Promise<object[]>} Promise with an array of users on success
 * otherwise an error.
 */
export async function find() {
  const queryParameters = 'limit=10';

  return api.get(`/api/Users?${queryParameters}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data.results)
    .catch(manageError);
}

/**
 * Get user by id.
 * @param {string} id - User id.
 * @returns {Promise<object>} Return a user.
 */
export async function findById(id) {
  return api.get(`/api/Users/${id}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data)
    .catch(manageError);
}

/**
 * Remove user by id.
 * @param {string} id - User id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/api/Users/${id}`, { headers: getDefaultHeaders() })
    .catch(manageError);
}
