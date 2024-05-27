import {
  ref,
  computed,
} from 'vue';
import { useDialog } from 'src/composables/Dialog';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';

/**
 * Composable that extends useDialog to manage detach user and access control dialogs.
 * @param {string} dialogName - Name of the dialog.
 * @param {string} key - Dialog event key.
 * @param {string} source - The entity that another entity is being detached from.
 * @param {string} target - The detached entity.
 * @returns {object} Object with refs and functions to manage detach access control dialog.
 */
export function useDetachDialog(dialogName, key, source, target) {
  const userStore = useUserStore();
  const submitting = ref(false);
  const group = ref(null);
  const role = ref(null);
  const user = ref();
  const isCurrentUser = computed(() => user.value?.login === userStore.login);

  const { show } = useDialog(key, (event) => {
    submitting.value = false;
    group.value = event.group;
    user.value = event.user;
    role.value = event.role;
  });

  const { t } = useI18n();

  /**
   * Dispatch a reload event for users, groups, or roles
   * depending on the value of the `target` variable.
   * @returns {void}
   */
  function reloadEvent() {
    if (target === 'user') {
      return ReloadUsersEvent.next();
    }

    if (target === 'group') {
      return ReloadGroupsEvent.next();
    }

    return ReloadRolesEvent.next();
  }

  /**
   * Invoke the appropriate dissociate method from GroupService or RoleService.
   * @returns {Promise<void>} Promise with nothing on success.
   */
  async function dissociate() {
    if ([source, target].includes('group')) {
      return GroupService.dissociateGroupAndUser(user.value.login, group.value.id);
    }

    return RoleService.dissociateRoleAndUser(user.value.login, role.value.id);
  }

  /**
   * Manage the current user's permissions and trigger appropriate events.
   * @returns {Promise<void>} Promise with nothing on success.
   */
  async function manageUserRolePermissions() {
    if (isCurrentUser.value) {
      userStore.permissions = await UserService.getMyPermissions();

      if (!userStore.isAdmin) {
        DialogEvent.next({
          key: 'redirect',
          type: 'open',
        });
      }
    }

    if (!isCurrentUser.value || (isCurrentUser.value && userStore.isAdmin)) {
      reloadEvent();
    }
  }

  /**
   * Detach user, send event to reload users and close dialog.
   * @returns {Promise<void>} Promise with nothing on success.
   */
  async function detach() {
    submitting.value = true;

    return dissociate().then(async () => {
      Notify.create({
        type: 'positive',
        message: t(`${dialogName}.text.notifySuccess`),
        html: true,
      });

      if ([source, target].includes('role')) {
        manageUserRolePermissions();
      } else {
        reloadEvent();

        if (isCurrentUser.value) {
          userStore.permissions = await UserService.getMyPermissions();
        }
      }
    }).catch(() => {
      Notify.create({
        type: 'negative',
        message: t(`${dialogName}.text.notifyError`),
        html: true,
      });
    }).finally(() => {
      submitting.value = false;
      show.value = false;
    });
  }

  return {
    show,
    submitting,
    user,
    group,
    role,
    isCurrentUser,
    detach,
  };
}
