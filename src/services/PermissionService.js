import {
  prepareQueryParameters,
  prepareRequest,
  makeFilterRequest,
} from 'boot/axios';

/**
 * Generates permission key based on the provided permission object.
 * @param {object} permission - Permission object.
 * @param {string} permission.entity - The entity for which the permission is granted.
 * @param {string} permission.action - The action associated with the permission.
 * @param {string} permission.libraryId - Optional library ID associated with the permission.
 * @returns {string} String corresponding to the 'key' permission property.
 */
export function generatePermissionKey(permission) {
  return `${permission.entity}_${permission.action}_${permission.libraryId ? 'ID' : 'NULL'}`;
}

/**
 * Get all permissions.
 * @returns {Promise<object[]>} Promise with an array of permissions on success
 * otherwise an error.
 */
export async function find() {
  const api = await prepareRequest();

  return api.get('/permissions').then(({ data }) => ({
    ...data,
    content: data.content.map((permission) => ({
      ...permission,
      key: generatePermissionKey(permission),
    })),
  }));
}

/**
 * Get permissions of a user by its login.
 * @param {string} login - User login.
 * @param {object} filters - API filters.
 * @returns {Promise<object>} Promise with the permissions of a user on success
 * otherwise an error.
 */
export async function findByLogin(login, filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `/users/${login}/permissions${queryParameters}`).then(({ data }) => ({
    ...data,
    content: data.content.map((permission) => ({
      ...permission,
      key: generatePermissionKey(permission),
    })),
  }));
}

/**
 * Get all permissions of a role.
 * @param {string} roleId - Role id.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Return an array of permissions.
 */
export async function findByRoleId(roleId, filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `roles/${roleId}/permissions${queryParameters}`).then(({ data }) => ({
    ...data,
    content: data.content.map((permission) => ({
      ...permission,
      key: generatePermissionKey(permission),
    })),
  }));
}

/**
 * Get all permissions associated to the group.
 * @param {string} groupId - Group id.
 * @param {object} filters - API filters.
 * @returns {Promise<object[]>} Return an array of groups.
 */
export async function findByGroupId(groupId, filters) {
  const api = await prepareRequest();
  const queryParameters = prepareQueryParameters(filters);

  return makeFilterRequest(api, `groups/${groupId}/permissions${queryParameters}`).then(({ data }) => ({
    ...data,
    content: data.content.map((permission) => ({
      ...permission,
      key: generatePermissionKey(permission),
    })),
  }));
}
