import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'src/stores/UserStore';
import { vi } from 'vitest';
import { useAttachDialog } from 'src/composables/AttachDialog';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/composables/events/ReloadUsersEvent');
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/ReloadRolesEvent');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.mock('src/services/GroupService');
vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.mock('src/stores/UserStore');
vi.mock('vue-i18n');

describe('Test: useAttachDialog', () => {
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
    ReloadPermissionsEvent.next = vi.fn();

    UserService.getMyPermissions.mockImplementation(() => Promise.resolve('updated user permissions'));

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
      components: { useAttachDialog },
      setup() {
        return useAttachDialog(dialogName, key, source, target);
      },
    });

    wrapper.vm.show = true;
  }

  describe('Test function: reloadEvent', () => {
    it('should call ReloadUserEvent when the target is "user"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'user');
      wrapper.vm.roleId = 'role1';
      wrapper.vm.userLogin = 'user1';

      await wrapper.vm.attach();

      expect(ReloadUsersEvent.next).toHaveBeenCalled();
    });

    it('should call ReloadGroupsEvent when the target is "group"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'group');
      wrapper.vm.groupId = 'group1';
      wrapper.vm.userLogin = 'user1';

      await wrapper.vm.attach();

      expect(ReloadGroupsEvent.next).toHaveBeenCalled();
    });

    it('should call ReloadRolesEvent when the target is "role"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'role');
      wrapper.vm.roleId = 'role1';
      wrapper.vm.userLogin = 'user1';

      await wrapper.vm.attach();

      expect(ReloadRolesEvent.next).toHaveBeenCalled();
    });

    it('should call ReloadPermissionsEvent otherwise', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'permission');
      wrapper.vm.roleId = 'role1';
      wrapper.vm.userLogin = 'user1';

      await wrapper.vm.attach();

      expect(ReloadPermissionsEvent.next).toHaveBeenCalled();
    });
  });

  describe('Test function: associate', () => {
    it('should call associateGroupAndUser if source is "user" and target is "group"', async () => {
      mountComponent('testDialog', 'testKey', 'user', 'group');
      wrapper.vm.userLogin = 'user1';
      wrapper.vm.selected = [{ id: 'group1' }];

      await wrapper.vm.attach();

      expect(GroupService.associateGroupAndUser).toHaveBeenCalledWith('user1', 'group1');
    });

    it('should call associateGroupAndUser if source is "group" and target is "user"', async () => {
      mountComponent('testDialog', 'testKey', 'group', 'user');
      wrapper.vm.groupId = 'group1';
      wrapper.vm.selected = [{ login: 'user1' }];

      await wrapper.vm.attach();

      expect(GroupService.associateGroupAndUser).toHaveBeenCalledWith('user1', 'group1');
    });

    it('should call associateRoleAndUser if source is "role" and target is "user"', async () => {
      mountComponent('testDialog', 'testKey', 'role', 'user');
      wrapper.vm.roleId = 'role1';
      wrapper.vm.selected = [{ login: 'user1' }];

      await wrapper.vm.attach();

      expect(RoleService.associateRoleAndUser).toHaveBeenCalledWith('user1', 'role1');
    });

    it('should call associateRoleAndUser if source is "user" and target is "role"', async () => {
      mountComponent('testDialog', 'testKey', 'user', 'role');
      wrapper.vm.userLogin = 'user1';
      wrapper.vm.selected = [{ id: 'role1' }];
      userStore.login = 'user1';

      await wrapper.vm.attach();

      expect(RoleService.associateRoleAndUser).toHaveBeenCalledWith('user1', 'role1');
    });

    it('should call associateRoleAndPermission if target is "permission"', async () => {
      mountComponent('testDialog', 'testKey', 'source', 'permission');
      wrapper.vm.roleId = 'role1';
      wrapper.vm.selected = [{ id: 'permission1' }];

      await wrapper.vm.attach();

      expect(RoleService.associateRoleAndPermission).toHaveBeenCalledWith('role1', 'permission1');
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      mountComponent('testDialog', 'testKey', 'group', 'user');
      wrapper.vm.groupId = 'group1';
      wrapper.vm.userLogin = 'user1';
      wrapper.vm.selected = [{ login: 'user1' }];
      wrapper.vm.submitting = true;
      wrapper.vm.selectOnly = true;
      userStore.permissions = 'user permissions';

      Notify.create = vi.fn();
    });

    it('should call appropriate event reload and service with dissociate function, then show success notification', async () => {
      await wrapper.vm.attach();

      expect(ReloadUsersEvent.next).toHaveBeenCalled();
      expect(GroupService.associateGroupAndUser).toHaveBeenCalledWith('user1', 'group1');
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'testDialog.text.notifySuccess',
        html: true,
      });
      expect(wrapper.vm.show).toBeFalsy();
      expect(wrapper.vm.submitting).toBeFalsy();
    });

    it('should handle error and show error notification', async () => {
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.reject());

      await wrapper.vm.attach();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'testDialog.text.notifyError',
        html: true,
      });
      expect(wrapper.vm.show).toBeTruthy();
      expect(wrapper.vm.submitting).toBeFalsy();
    });

    it('should update user permission', async () => {
      wrapper.vm.userLogin = 'user1';
      wrapper.vm.selected = [{ login: 'user2' }];
      userStore.login = 'user2';

      expect(userStore.permissions).toEqual('user permissions');

      await wrapper.vm.attach();

      expect(userStore.permissions).toEqual('updated user permissions');
    });
  });
});
