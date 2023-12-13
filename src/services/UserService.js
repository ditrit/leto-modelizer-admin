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
