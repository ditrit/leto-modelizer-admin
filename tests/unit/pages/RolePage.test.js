import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolePage from 'pages/RolePage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import * as RoleService from 'src/services/RoleService';
import * as PermissionService from 'src/services/PermissionService';
import { useRoute, useRouter } from 'vue-router';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('src/services/UserService');
vi.mock('src/services/RoleService');
vi.mock('src/services/PermissionService');
vi.mock('vue-router');
vi.mock('src/composables/events/ReloadUsersEvent');
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/ReloadRolesEvent');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: RolePage', () => {
  let wrapper;
  let push;
  let reloadUsersSubscribe;
  let reloadUsersUnsubscribe;
  let reloadGroupsSubscribe;
  let reloadGroupsUnsubscribe;
  let reloadRolesSubscribe;
  let reloadRolesUnsubscribe;
  let reloadPermissionsSubscribe;
  let reloadPermissionsUnsubscribe;

  const role = {
    id: 1,
  };

  beforeEach(() => {
    reloadUsersSubscribe = vi.fn();
    reloadUsersUnsubscribe = vi.fn();
    reloadGroupsSubscribe = vi.fn();
    reloadGroupsUnsubscribe = vi.fn();
    reloadRolesSubscribe = vi.fn();
    reloadRolesUnsubscribe = vi.fn();
    reloadPermissionsSubscribe = vi.fn();
    reloadPermissionsUnsubscribe = vi.fn();

    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    RoleService.findById.mockImplementation(() => Promise.resolve(role));
    RoleService.findSubRoles.mockImplementation(() => Promise.resolve({ content: 'roles' }));
    PermissionService.findByRoleId.mockImplementation(() => Promise.resolve({ content: 'permissions' }));
    UserService.findByRoleId.mockImplementation(() => Promise.resolve({ content: 'users' }));
    GroupService.findByRoleId.mockImplementation(() => Promise.resolve({ content: 'groups' }));

    ReloadUsersEvent.subscribe.mockImplementation(() => {
      reloadUsersSubscribe();
      return { unsubscribe: reloadUsersUnsubscribe };
    });

    ReloadGroupsEvent.subscribe.mockImplementation(() => {
      reloadGroupsSubscribe();
      return { unsubscribe: reloadGroupsUnsubscribe };
    });

    ReloadRolesEvent.subscribe.mockImplementation(() => {
      reloadRolesSubscribe();
      return { unsubscribe: reloadRolesUnsubscribe };
    });

    ReloadPermissionsEvent.subscribe.mockImplementation(() => {
      reloadPermissionsSubscribe();
      return { unsubscribe: reloadPermissionsUnsubscribe };
    });

    wrapper = shallowMount(RolePage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadRole', () => {
    it('should set data on valid role', async () => {
      await wrapper.vm.loadRole();

      expect(wrapper.vm.role).toEqual(role);
    });

    it('should redirect on unknown role', async () => {
      RoleService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadRole();

      expect(push).toBeCalledWith('/roles');
    });
  });

  describe('Test function: loadGroups', () => {
    it('should set groups', async () => {
      await wrapper.vm.loadGroups();

      expect(wrapper.vm.groups).toEqual('groups');
    });
  });

  describe('Test function: loadUsers', () => {
    it('should set users', async () => {
      await wrapper.vm.loadUsers();

      expect(wrapper.vm.users).toEqual('users');
    });
  });

  describe('Test function: loadRoles', () => {
    it('should set roles', async () => {
      await wrapper.vm.loadRoles();

      expect(wrapper.vm.roles).toEqual('roles');
    });
  });

  describe('Test function: loadPermissions', () => {
    it('should set permissions', async () => {
      await wrapper.vm.loadPermissions();

      expect(wrapper.vm.permissions).toEqual('permissions');
    });
  });

  describe('Test function: openAttachUserToRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachUserToRoleDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-user-to-role',
        type: 'open',
        roleId: 'id1',
      });
    });
  });

  describe('Test function: openAttachGroupToRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachGroupToRoleDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-role',
        type: 'open',
        roleId: 'id1',
      });
    });
  });

  describe('Test function: openAttachRoleToRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachRoleToRoleDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-role',
        type: 'open',
        roleId: 'id1',
      });
    });
  });

  describe('Test function: openAttachPermissionToRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachPermissionToRoleDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-permission-to-role',
        type: 'open',
        roleId: 'id1',
      });
    });
  });

  describe('Test function: openDetachUserFromRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachUserFromRoleDialog('user');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-user-from-role',
        type: 'open',
        user: 'user',
        role: { id: 1 },
      });
    });
  });

  describe('Test function: openDetachGroupFromRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachGroupFromRoleDialog('group');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-group-from-role',
        type: 'open',
        group: 'group',
        role: { id: 1 },
      });
    });
  });

  describe('Test function: openDetachRoleFromRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachRoleFromRoleDialog('roleToDetach');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-role-from-role',
        type: 'open',
        roleToDetach: 'roleToDetach',
        role: { id: 1 },
      });
    });
  });

  describe('Test function: openDetachPermissionFromRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachPermissionFromRoleDialog('permission');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-permission-from-role',
        type: 'open',
        permission: 'permission',
        role: { id: 1 },
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadUsersEvent', () => {
      expect(reloadUsersSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe ReloadGroupsEvent', () => {
      expect(reloadGroupsSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe ReloadPermissionsEvent', () => {
      expect(reloadPermissionsSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadUsersEvent', () => {
      expect(reloadUsersUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(reloadUsersUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe ReloadGroupsEvent', () => {
      expect(reloadGroupsUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(reloadGroupsUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe ReloadPermissionsEvent', () => {
      expect(reloadPermissionsUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(reloadPermissionsUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
