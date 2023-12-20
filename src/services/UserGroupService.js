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

/**
 * Get userGroup by id.
 * @param {string} id - UserGroup id.
 * @returns {Promise<object>} Return a userGroup.
 */
export async function findById(id) {
  return api.get(`/api/classes/Group/${id}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data)
    .catch(manageError);
}
