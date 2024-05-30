import {
  ref,
  computed,
} from 'vue';
import { useDialog } from 'src/composables/Dialog';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import SelectEvent from 'src/composables/events/SelectEvent';
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
 * @param {Function} searchFunction - Function to call.
 * @returns {object} Object with refs and functions to manage detach access control dialog.
 */
export function useAttachDialog(dialogName, key, source, target, searchFunction) {
  const userStore = useUserStore();
  const submitting = ref(false);
  const selectOnly = ref(false);
  const selected = ref([]);
  const groupId = ref(null);
  const roleId = ref(null);
  const userLogin = ref();
  const isCurrentUser = computed(() => userLogin.value === userStore.login);

  const { show } = useDialog(key, (event) => {
    submitting.value = false;
    groupId.value = event.groupId;
    roleId.value = event.roleId;
    userLogin.value = event.userLogin;
    selected.value = [];
    selectOnly.value = event.selectOnly || false;
    if (searchFunction) searchFunction();
  });

  const { t } = useI18n();

  /**
   * Dispatch a reload event for users, groups, roles or permissions
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

    if (target === 'role') {
      return ReloadRolesEvent.next();
    }

    return ReloadPermissionsEvent.next();
  }

  /**
   * Invoke the appropriate associate method from GroupService or RoleService.
   * @param {string} selectedId - Selected id of the item to be attached.
   * @returns {Promise<void>} Promise with nothing on success.
   */
  async function associate(selectedId) {
    if (target === 'permission') {
      return RoleService.associateRoleAndPermission(roleId.value, selectedId);
    }

    if (target === 'group' && source === 'user') {
      return GroupService.associateGroupAndUser(userLogin.value, selectedId);
    }

    if (target === 'user' && source === 'group') {
      return GroupService.associateGroupAndUser(selectedId, groupId.value);
    }

    if (target === 'user' && source === 'role') {
      return RoleService.associateRoleAndUser(selectedId, roleId.value);
    }

    return RoleService.associateRoleAndUser(userLogin.value, selectedId);
  }

  /**
   * Handle failed requests by filtering out specific items based on the rejection reason message.
   * @param {Array<object>} results - results array containing status and reason of each request.
   * @param {string} results[].status - status of the request ('fulfilled' or 'rejected').
   * @param {object} results[].reason - reason object if the request was rejected.
   * @param {string} results[].reason.message - message describing why the request was rejected.
   */
  function handleFailedRequest(results) {
    const failedRequestObjects = [];

    results.forEach(({ status, reason }) => {
      if (status === 'rejected' && reason.message) {
        const filterKey = target === 'user' ? 'login' : 'id';

        failedRequestObjects.push(...selected.value
          .filter((item) => item[filterKey] === reason.message));
      }
    });

    selected.value = failedRequestObjects;
  }

  /**
   * Attach one or more groups to a user.
   * @returns {Promise<void>} Promise with nothing on success.
   */
  async function attach() {
    if (selectOnly.value) {
      SelectEvent.SelectUsersEvent.next(selected.value);
      show.value = false;

      return;
    }

    submitting.value = true;

    const selectedIdList = selected.value.map((item) => (target === 'user' ? item.login : item.id));

    await Promise.allSettled(selectedIdList
      .map((selectedId) => associate(selectedId)
        .catch(() => {
          Notify.create({
            type: 'negative',
            message: t(`${dialogName}.text.notifyError`),
            html: true,
          });

          throw new Error(selectedId);
        })))
      .then((results) => {
        handleFailedRequest(results);

        if (results.every(({ status }) => status === 'fulfilled')) {
          Notify.create({
            type: 'positive',
            message: t(`${dialogName}.text.notifySuccess`),
            html: true,
          });

          show.value = false;
        }
      }).finally(async () => {
        reloadEvent();
        submitting.value = false;

        if (isCurrentUser.value || selectedIdList.includes(userStore.login) || target === 'permission') {
          userStore.permissions = await UserService.getMyPermissions();
        }
      });
  }

  return {
    show,
    submitting,
    userLogin,
    groupId,
    roleId,
    isCurrentUser,
    selected,
    attach,
  };
}
