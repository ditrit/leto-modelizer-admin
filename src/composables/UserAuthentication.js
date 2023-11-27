import { getUserInformation, getUserRoles } from 'src/composables/LetoModelizerApi';
import { useUserStore } from 'stores/UserStore';

/**
 * Set the current user's session token in the local storage.
 * @param {string} sessionToken - The session token to store.
 */
export function setUserSessionToken(sessionToken) {
  localStorage.setItem('sessionToken', sessionToken);
}

/**
 * Get the current user's session token from the local storage.
 * @returns {string|null} The user's session token from the local storage.
 */
export function getUserSessionToken() {
  return localStorage.getItem('sessionToken');
}

/**
 * Init user information and roles.
 * @param {string} sessionToken - The current user's session token.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error. Error is thrown if
 * user doesn't have the 'admin' role.
 */
export async function initUser(sessionToken) {
  const userStore = useUserStore();

  if (userStore.ready) {
    return;
  }

  let response = await getUserInformation(sessionToken);

  userStore.id = response.data.objectId;
  userStore.username = response.data.username;
  userStore.firstname = response.data.firstname;

  response = await getUserRoles(response.data.objectId, sessionToken);

  userStore.roles = response.data.results.map(({ name }) => name);
  userStore.ready = true;

  if (!userStore.roles.includes('admin')) {
    throw new Error();
  }
}
