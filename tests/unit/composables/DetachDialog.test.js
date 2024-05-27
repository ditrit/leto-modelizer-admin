import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';
import { vi } from 'vitest';
import { useDetachDialog } from 'src/composables/DetachDialog';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/composables/events/DialogEvent');
vi.mock('src/composables/events/ReloadUsersEvent');
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/ReloadRolesEvent');
vi.mock('src/services/GroupService');
vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.mock('src/stores/UserStore');
vi.mock('vue-i18n');

describe('Test: useDetachDialog', () => {
  let wrapper;
  let userStore;

  beforeEach(() => {
    userStore = {
      login: 'current_user',
      isAdmin: false,
      permissions: [],
    };
    useUserStore.mockReturnValue(userStore);

    ReloadUsersEvent.next = vi.fn();
    ReloadGroupsEvent.next = vi.fn();
    ReloadRolesEvent.next = vi.fn();

    useI18n.mockReturnValue({
      t: (key) => key,
    });
  });

  /**
   * Mount component with composable.
   * @param {string} dialogName - Name of the dialog.
   * @param {string} key - Dialog event key.
   * @param {string} source - The entity that another entity is being detached from.
   * @param {string} target - The detached entity.
   */
  function mountComponent(dialogName = 'testDialog', key = 'testKey', source = 'group', target = 'user') {
    wrapper = mount({
      template: '<div id="dialog" v-if="show"></div>',
      components: { useDetachDialog },
      setup() {
        return useDetachDialog(dialogName, key, source, target);
      },
    });

    wrapper.vm.show = true;
  }

  describe('Test function: reloadEvent', () => {
    it('should call ReloadUserEvent when the target is "user"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'user');
      wrapper.vm.role = { id: 'role1' };
      wrapper.vm.user = { login: 'user1' };

      await wrapper.vm.detach();

      expect(ReloadUsersEvent.next).toHaveBeenCalled();
    });

    it('should call ReloadGroupsEvent when the target is "group"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'group');
      wrapper.vm.group = { id: 'group1' };
      wrapper.vm.user = { login: 'user1' };

      await wrapper.vm.detach();

      expect(ReloadGroupsEvent.next).toHaveBeenCalled();
    });

    it('should call ReloadRolesEvent when the target is "role"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'role');
      wrapper.vm.role = { id: 'role1' };
      wrapper.vm.user = { login: 'user1' };

      await wrapper.vm.detach();

      expect(ReloadRolesEvent.next).toHaveBeenCalled();
    });
  });

  describe('Test function: dissociate', () => {
    it('should call dissociateGroupAndUser if source or target is group', async () => {
      mountComponent('testDialog', 'testKey', 'group', 'user');
      wrapper.vm.user = { login: 'user1' };
      wrapper.vm.group = { id: 'group1' };

      await wrapper.vm.detach();

      expect(GroupService.dissociateGroupAndUser).toHaveBeenCalledWith('user1', 'group1');
    });

    it('should call dissociateRoleAndUser if source or target is role', async () => {
      mountComponent('testDialog', 'testKey', 'role', 'user');
      wrapper.vm.user = { login: 'user1' };
      wrapper.vm.role = { id: 'role1' };

      await wrapper.vm.detach();

      expect(RoleService.dissociateRoleAndUser).toHaveBeenCalledWith('user1', 'role1');
    });
  });

  describe('Test function: manageUserRolePermissions', () => {
    beforeEach(() => {
      mountComponent('testDialog', 'testKey', 'user', 'role');
      userStore.login = 'user1';
      userStore.permissions = 'user permissions';
      wrapper.vm.role = { id: 'role1' };
      wrapper.vm.user = { login: 'user1' };

      UserService.getMyPermissions.mockImplementation(() => Promise.resolve('updated user permissions'));
      DialogEvent.next.mockReset();
    });

    it('should update user permissions and call DialogEvent when user is current and not admin', async () => {
      userStore.isAdmin = false;

      await wrapper.vm.detach();

      expect(userStore.permissions).toEqual('updated user permissions');
      expect(DialogEvent.next).toHaveBeenCalled();
    });

    it('should update user permissions and call reload event when user is current and admin', async () => {
      userStore.isAdmin = true;

      await wrapper.vm.detach();

      expect(userStore.permissions).toEqual('updated user permissions');
      expect(ReloadRolesEvent.next).toHaveBeenCalled();
      expect(DialogEvent.next).not.toHaveBeenCalled();
    });

    it('should only call reload event when user is not current', async () => {
      wrapper.vm.user = { login: 'notCurrent' };

      await wrapper.vm.detach();

      expect(ReloadRolesEvent.next).toHaveBeenCalled();
      expect(DialogEvent.next).not.toHaveBeenCalled();
      expect(userStore.permissions).toEqual('user permissions');
    });
  });

  describe('Test function: detach', () => {
    beforeEach(() => {
      mountComponent('testDialog', 'testKey', 'group', 'user');
      wrapper.vm.group = { id: 'group1' };
      wrapper.vm.user = { login: 'user1' };
      wrapper.vm.submitting = true;

      Notify.create = vi.fn();
    });

    it('should call appropriate event reload and service with dissociate function, then show success notification', async () => {
      userStore.login = 'user1';

      await wrapper.vm.detach();

      expect(ReloadUsersEvent.next).toHaveBeenCalled();
      expect(GroupService.dissociateGroupAndUser).toHaveBeenCalledWith('user1', 'group1');
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'testDialog.text.notifySuccess',
        html: true,
      });
      expect(wrapper.vm.show).toBeFalsy();
      expect(wrapper.vm.submitting).toBeFalsy();
    });

    it('should handle error and show error notification', async () => {
      GroupService.dissociateGroupAndUser.mockRejectedValueOnce(new Error('Error'));

      await wrapper.vm.detach();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'testDialog.text.notifyError',
        html: true,
      });
      expect(wrapper.vm.show).toBeFalsy();
      expect(wrapper.vm.submitting).toBeFalsy();
    });
  });
});
