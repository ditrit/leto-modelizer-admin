import { prepareQueryParameters, prepareRequest } from 'boot/axios';

/**
 * Get all groups.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Promise with an array of groups on success
 * otherwise an error.
 */
export async function find(filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return api.get(`/groups${queryParameters}`).then(({ data }) => data);
}

/**
 * Get group by id.
 * @param {string} id - Group id.
 * @returns {Promise<object>} Return a group.
 */
export async function findById(id) {
  const api = await prepareRequest();

  return api.get(`/groups/${id}`).then(({ data }) => data);
}

/**
 * Create group.
 * @param {string} name - Group name.
 * @returns {Promise<object>} Promise with group object on success otherwise an error.
 */
export async function create(name) {
  const api = await prepareRequest();

  return api.post('/groups', { name }).then(({ data }) => data);
}

/**
 * Remove group by id.
 * @param {string} id - Group id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  const api = await prepareRequest();

  return api.delete(`/groups/${id}`);
}

/**
 * Get all groups of a user by its login.
 * @param {string} login - User login.
 * @returns {Promise<object[]>} Return an array of groups.
 */
export async function findByLogin(login) {
  const api = await prepareRequest();

  return api.get(`users/${login}/groups`).then(({ data }) => data);
}

/**
 * Get all groups of a role.
 * @param {string} roleId - Role id.
 * @returns {Promise<object[]>} Return an array of groups.
 */
export async function findByRoleId(roleId) {
  const api = await prepareRequest();

  return api.get(`roles/${roleId}/groups`)
    .then(({ data }) => data);
}

/**
 * Get all groups associated to the group.
 * @param {string} groupId - Group id.
 * @returns {Promise<object[]>} Return an array of groups.
 */
export async function findSubGroups(groupId) {
  const api = await prepareRequest();

  return api.get(`groups/${groupId}/groups`).then(({ data }) => data);
}

/**
 * Associate group and user.
 * @param {string} userLogin - User login.
 * @param {string} groupId - Group id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function associateGroupAndUser(userLogin, groupId) {
  const api = await prepareRequest();

  return api.post(`/groups/${groupId}/users`, userLogin, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Dissociate group and user.
 * @param {string} userLogin - User login.
 * @param {string} groupId - Group id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateGroupAndUser(userLogin, groupId) {
  const api = await prepareRequest();

  return api.delete(`/groups/${groupId}/users/${userLogin}`);
}

/**
 * Associate group and group.
 * @param {string} groupId - Group id.
 * @param {string} groupIdToAttach - Group id to attach to the group.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function associateGroupAndGroup(groupId, groupIdToAttach) {
  const api = await prepareRequest();

  return api.post(`/groups/${groupId}/groups`, groupIdToAttach, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Dissociate group and group.
 * @param {string} groupId - Group id.
 * @param {string} groupIdToDetach - Group id to detach to the group.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateGroupAndGroup(groupId, groupIdToDetach) {
  const api = await prepareRequest();

  return api.delete(`/groups/${groupId}/groups/${groupIdToDetach}`);
}
