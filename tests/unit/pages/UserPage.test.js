import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserPage from 'pages/UserPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as PermissionService from 'src/services/PermissionService';
import { useRoute, useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/UserService');
vi.mock('src/services/GroupService');
vi.mock('src/services/RoleService');
vi.mock('src/services/PermissionService');
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: UserPage', () => {
  let wrapper;
  let push;
  let subscribe;
  let unsubscribe;
  const user = {
    id: 1,
  };

  beforeEach(() => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { login: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    UserService.findByLogin.mockImplementation(() => Promise.resolve(user));
    PermissionService.findByLogin.mockImplementation(() => Promise.resolve({ content: ['permission'] }));
    GroupService.findByLogin.mockImplementation(() => Promise.resolve({ content: ['group'] }));
    RoleService.findByLogin.mockImplementation(() => Promise.resolve({ content: [{ name: 'role', type: 'type' }] }));

    ReloadGroupsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(UserPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadUser', () => {
    it('should set data on valid user', async () => {
      wrapper.vm.user = {};
      wrapper.vm.loading = true;

      await wrapper.vm.loadUser();

      expect(wrapper.vm.user).toEqual(user);
      expect(wrapper.vm.loading).toBeFalsy();
    });

    it('should redirect on unknown user', async () => {
      UserService.findByLogin.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUser();

      expect(push).toBeCalledWith('/users');
    });
  });

  describe('Test function: loadGroups', () => {
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.loadGroups();

      expect(wrapper.vm.groups).toEqual(['group']);
    });
  });

  describe('Test function: loadRoles', () => {
    it('should set roles', async () => {
      wrapper.vm.roles = [];

      await wrapper.vm.loadRoles();

      expect(wrapper.vm.roles).toEqual([{ name: 'role', type: 'type' }]);
    });
  });

  describe('Test function: loadPermissions', () => {
    it('should set permissions', async () => {
      wrapper.vm.permissions = [];

      await wrapper.vm.loadPermissions();

      expect(wrapper.vm.permissions).toEqual(['permission']);
    });
  });

  describe('Test function: openAttachGroupToUserDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachGroupToUserDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-user',
        type: 'open',
        userLogin: 'id1',
      });
    });
  });

  describe('Test function: openAttachRoleToUserDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachRoleToUserDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-user',
        type: 'open',
        userLogin: 'id1',
      });
    });
  });

  describe('Test function: openDetachGroupFromUserDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachGroupFromUserDialog('group');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-group-from-user',
        type: 'open',
        group: 'group',
        user: {
          id: 1,
        },
      });
    });
  });

  describe('Test function: openDetachRoleFromUserDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachRoleFromUserDialog('role');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-role-from-user',
        type: 'open',
        role: 'role',
        user: {
          id: 1,
        },
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadGroupsEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadGroupsEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
