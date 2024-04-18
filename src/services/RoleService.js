import {
  prepareQueryParameters,
  prepareRequest,
  makeFilterRequest,
} from 'boot/axios';

/**
 * Get all roles.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Promise with an array of roles on success
 * otherwise an error.
 */
export async function find(filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/roles${queryParameters}`).then(({ data }) => data);
}

/**
 * Get role by id.
 * @param {string} id - Role id.
 * @returns {Promise<object>} Return a role.
 */
export async function findById(id) {
  const api = await prepareRequest();

  return api.get(`/roles/${id}`).then(({ data }) => data);
}

/**
 * Get all roles of a user by its login.
 * @param {string} userLogin - User login.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Return an array of roles.
 */
export async function findByLogin(userLogin, filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/users/${userLogin}/roles${queryParameters}`).then(({ data }) => data);
}

/**
 * Create role.
 * @param {string} name - Role name.
 * @returns {Promise<object>} Promise with role object on success otherwise an error.
 */
export async function create(name) {
  const api = await prepareRequest();

  return api.post('/roles', { name }).then(({ data }) => data);
}

/**
 * Remove role by id.
 * @param {string} id - Role id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
export async function remove(id) {
  const api = await prepareRequest();

  return api.delete(`/roles/${id}`);
}

/**
 * Associate role and user.
 * @param {string} userLogin - User login.
 * @param {string} roleId - Role id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function associateRoleAndUser(userLogin, roleId) {
  const api = await prepareRequest();

  return api.post(`/roles/${roleId}/users`, userLogin, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Dissociate role and user.
 * @param {string} userLogin - User login.
 * @param {string} roleId - Role id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateRoleAndUser(userLogin, roleId) {
  const api = await prepareRequest();

  return api.delete(`/roles/${roleId}/users/${userLogin}`);
}

/**
 * Get all roles of a group.
 * @param {string} groupId - Group id.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Return an array of roles.
 */
export async function findByGroupId(groupId, filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `groups/${groupId}/roles${queryParameters}`)
    .then(({ data }) => data);
}

/**
 * Get all sub roles of a role.
 * @param {string} roleId - Role id.
 * @param {object} filters - API filters.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function findSubRoles(roleId, filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/roles/${roleId}/roles${queryParameters}`)
    .then(({ data }) => data);
}

/**
 * Associate role and group.
 * @param {string} groupId - Group id.
 * @param {string} roleId - Role id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function associateRoleAndGroup(groupId, roleId) {
  const api = await prepareRequest();

  return api.post(`/roles/${roleId}/groups`, groupId, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Dissociate role and group.
 * @param {string} groupId - Group id.
 * @param {string} roleId - Role id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateRoleAndGroup(groupId, roleId) {
  const api = await prepareRequest();

  return api.delete(`/roles/${roleId}/groups/${groupId}`);
}

/**
 * Associate role and permission.
 * @param {string} roleId - Role id.
 * @param {string} permissionId - Permission id.
 * @returns {Promise<object[]>} Return an array of permissions.
 */
export async function associateRoleAndPermission(roleId, permissionId) {
  const api = await prepareRequest();

  return api.post(`/roles/${roleId}/permissions`, permissionId, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Dissociate role and permission.
 * @param {string} roleId - Role id.
 * @param {string} permissionId - Permission id.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateRoleAndPermission(roleId, permissionId) {
  const api = await prepareRequest();

  return api.delete(`/roles/${roleId}/permissions/${permissionId}`);
}

/**
 * Associate role and role.
 * @param {string} roleId - Role id.
 * @param {string} roleIdToAttach - Role id to attach to the role.
 * @returns {Promise<object[]>} Return an array of roles.
 */
export async function associateRoleAndRole(roleId, roleIdToAttach) {
  const api = await prepareRequest();

  return api.post(`/roles/${roleIdToAttach}/roles`, roleId, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Dissociate role and role.
 * @param {string} roleId - Role id.
 * @param {string} roleIdToDetach - Role id to detach to the role.
 * @returns {Promise<object>} Promise with nothing on success otherwise an error.
 */
export async function dissociateRoleAndRole(roleId, roleIdToDetach) {
  const api = await prepareRequest();

  return api.delete(`/roles/${roleIdToDetach}/roles/${roleId}`);
}
