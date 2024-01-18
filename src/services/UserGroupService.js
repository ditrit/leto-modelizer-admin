import { api, getDefaultHeaders, manageError } from 'boot/axios';

/**
 * Get all userGroups.
 * @returns {Promise<object[]>} Promise with an array of userGroups on success
 * otherwise an error.
 */
export async function find() {
  return api.get('/api/classes/Group', { headers: getDefaultHeaders() })
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

/**
 * Remove userGroup by id.
 * @param {string} id - UserGroup id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  return api.delete(`/api/classes/Group/${id}`, { headers: getDefaultHeaders() })
    .catch(manageError);
}

/**
 * Get all groups of a user.
 * @param {string} userId - User id.
 * @returns {Promise<object[]>} Return an array of groups.
 */
export async function findByUserId(userId) {
  const queryParameters = `where={"users":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}`;

  return api.get(`/api/classes/Group?${queryParameters}`, { headers: getDefaultHeaders() })
    .then(({ data }) => data.results)
    .catch(manageError);
}
