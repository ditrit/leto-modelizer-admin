import { useUserStore } from 'stores/UserStore';
import * as UserService from 'src/services/UserService';

/**
 * Init user information and permissions.
 * @returns {Promise<void>} Promise with nothing on success otherwise an error. Error is thrown if
 * user doesn't have the 'admin' related permissions.
 */
export async function initUser() {
  const userStore = useUserStore();

  if (userStore.ready) {
    return;
  }

  const user = await UserService.getCurrent();

  userStore.name = user.name;
  userStore.login = user.login;
  userStore.email = user.email;
  userStore.permissions = await UserService.getMyPermissions();
  userStore.ready = true;

  if (!userStore.isAdmin) {
    throw new Error();
  }
}
