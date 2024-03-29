import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupPage from 'pages/GroupPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import * as RoleService from 'src/services/RoleService';
import * as PermissionService from 'src/services/PermissionService';
import { useRoute, useRouter } from 'vue-router';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
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
vi.mock('src/composables/events/ReloadRolesEvent');
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: GroupPage', () => {
  let wrapper;
  let push;
  let reloadUsersSubscribe;
  let reloadUsersUnsubscribe;
  let reloadRolesSubscribe;
  let reloadRolesUnsubscribe;
  let reloadGroupsSubscribe;
  let reloadGroupsUnsubscribe;
  let reloadPermissionsSubscribe;
  let reloadPermissionsUnsubscribe;

  const group = {
    id: 1,
  };

  beforeEach(() => {
    reloadUsersSubscribe = vi.fn();
    reloadUsersUnsubscribe = vi.fn();
    reloadRolesSubscribe = vi.fn();
    reloadRolesUnsubscribe = vi.fn();
    reloadGroupsSubscribe = vi.fn();
    reloadGroupsUnsubscribe = vi.fn();
    reloadPermissionsSubscribe = vi.fn();
    reloadPermissionsUnsubscribe = vi.fn();

    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    GroupService.findById.mockImplementation(() => Promise.resolve(group));
    GroupService.findSubGroups.mockImplementation(() => Promise.resolve({ content: 'groups' }));
    PermissionService.findByGroupId.mockImplementation(() => Promise.resolve({ content: 'permissions' }));
    UserService.findByGroupId.mockImplementation(() => Promise.resolve({ content: 'users' }));
    RoleService.findByGroupId.mockImplementation(() => Promise.resolve({ content: 'roles' }));

    ReloadUsersEvent.subscribe.mockImplementation(() => {
      reloadUsersSubscribe();
      return { unsubscribe: reloadUsersUnsubscribe };
    });

    ReloadRolesEvent.subscribe.mockImplementation(() => {
      reloadRolesSubscribe();
      return { unsubscribe: reloadRolesUnsubscribe };
    });

    ReloadGroupsEvent.subscribe.mockImplementation(() => {
      reloadGroupsSubscribe();
      return { unsubscribe: reloadGroupsUnsubscribe };
    });

    ReloadPermissionsEvent.subscribe.mockImplementation(() => {
      reloadPermissionsSubscribe();
      return { unsubscribe: reloadPermissionsUnsubscribe };
    });

    wrapper = shallowMount(GroupPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadGroup', () => {
    it('should set data on valid group', async () => {
      await wrapper.vm.loadGroup();

      expect(wrapper.vm.group).toEqual(group);
    });

    it('should redirect on unknown group', async () => {
      GroupService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadGroup();

      expect(push).toBeCalledWith('/groups');
    });
  });

  describe('Test function: loadUsers', () => {
    it('should set users', async () => {
      await wrapper.vm.loadUsers();

      expect(wrapper.vm.users).toEqual('users');
    });
  });

  describe('Test function: loadGroups', () => {
    it('should set groups', async () => {
      await wrapper.vm.loadGroups();

      expect(wrapper.vm.groups).toEqual('groups');
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

  describe('Test function: openAttachUserToGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachUserToGroupDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-user-to-group',
        type: 'open',
        groupId: 'id1',
      });
    });
  });

  describe('Test function: openAttachRoleToGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachRoleToGroupDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-group',
        type: 'open',
        groupId: 'id1',
      });
    });
  });

  describe('Test function: openAttachGroupToGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachGroupToGroupDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-group',
        type: 'open',
        groupId: 'id1',
      });
    });
  });

  describe('Test function: openDetachUserFromGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachUserFromGroupDialog('user');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-user-from-group',
        type: 'open',
        group: { id: 1 },
        user: 'user',
      });
    });
  });

  describe('Test function: openDetachRoleFromGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachRoleFromGroupDialog('role');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-role-from-group',
        type: 'open',
        group: { id: 1 },
        role: 'role',
      });
    });
  });

  describe('Test function: openDetachGroupFromGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachGroupFromGroupDialog('grouptoDetach');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-group-from-group',
        type: 'open',
        group: { id: 1 },
        grouptoDetach: 'grouptoDetach',
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadUsersEvent', () => {
      expect(reloadUsersSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should subscribe ReloadRolesEvent', () => {
      expect(reloadRolesSubscribe).toHaveBeenCalledTimes(1);
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

    it('should unsubscribe ReloadRolesEvent', () => {
      expect(reloadRolesUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(reloadRolesUnsubscribe).toHaveBeenCalledTimes(1);
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
