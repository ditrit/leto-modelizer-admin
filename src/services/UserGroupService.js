import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get all userGroups.
 * @returns {Promise<object[]>} Promise with an array of userGroups on success
 * otherwise an error.
 */
export async function find() {
  const queryParameters = 'limit=10';

  return api.get(`/api/classes/Group?${queryParameters}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data.results)
    .catch(manageError);
}
