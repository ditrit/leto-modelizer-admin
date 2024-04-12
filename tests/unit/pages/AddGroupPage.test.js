import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import AddGroupPage from 'pages/AddGroupPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import DialogEvent from 'src/composables/events/DialogEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-i18n');
vi.mock('vue-router');
vi.mock('src/services/GroupService');
vi.mock('src/services/RoleService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: AddGroupPage', () => {
  let wrapper;
  let push;

  useI18n.mockImplementation(() => ({
    t: (v) => v,
  }));

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRouter.mockImplementation(() => ({ push }));

    wrapper = shallowMount(AddGroupPage);
  });

  describe('Test function: setSelectedUsers', () => {
    it('should set selectedUsers', () => {
      wrapper.vm.selectedUsers = [];

      wrapper.vm.setSelectedUsers([{ login: 'login', name: 'user' }]);

      expect(wrapper.vm.selectedUsers).toEqual([{ login: 'login', name: 'user' }]);
    });
  });

  describe('Test function: setSelectedRoles', () => {
    it('should set selectedRoles', () => {
      wrapper.vm.selectedRoles = [];

      wrapper.vm.setSelectedRoles([{ id: 'id', name: 'role' }]);

      expect(wrapper.vm.selectedRoles).toEqual([{ id: 'id', name: 'role' }]);
    });
  });

  describe('Test function: removeUser', () => {
    it('should update selectedUsers', async () => {
      wrapper.vm.selectedUsers = [
        { login: 'login1', name: 'user1' },
        { login: 'login2', name: 'user2' },
      ];

      await wrapper.vm.removeUser({ login: 'login2', name: 'user2' });

      expect(wrapper.vm.selectedUsers).toEqual([{ login: 'login1', name: 'user1' }]);
    });
  });

  describe('Test function: removeRole', () => {
    it('should update selectedRoles', () => {
      wrapper.vm.selectedRoles = [
        { id: 'id1', name: 'role1' },
        { id: 'id2', name: 'role2' },
      ];

      wrapper.vm.removeRole({ id: 'id2', name: 'role2' });

      expect(wrapper.vm.selectedRoles).toEqual([{ id: 'id1', name: 'role1' }]);
    });
  });

  describe('Test function: createNotification', () => {
    it('should create a notification with success message', () => {
      Notify.create = vi.fn();

      wrapper.vm.createNotification('success', 'dialogName');

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'success',
        message: 'dialogName.text.notifySuccess',
        html: true,
      });
    });

    it('should create a notification with error message', () => {
      Notify.create = vi.fn();

      wrapper.vm.createNotification('negative', 'dialogName');

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'dialogName.text.notifyError',
        html: true,
      });
    });
  });

  describe('Test function: handleGroupUserFailure', () => {
    it('should throw an error and update the rejectedUsers array correctly', () => {
      wrapper.vm.selectedUsers = [
        { login: 1, name: 'User1' },
        { login: 2, name: 'User2' },
        { login: 3, name: 'User3' },
      ];

      const rejectedUsers = [];
      const login = 2;
      let error = null;

      try {
        wrapper.vm.handleGroupUserFailure(rejectedUsers, login);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
      expect(rejectedUsers).toEqual([{ login: 2, name: 'User2' }]);
    });
  });

  describe('Test function: handleGroupRoleFailure', () => {
    it('should throw an error and update the rejectedRoles array correctly', () => {
      wrapper.vm.selectedRoles = [
        { id: 1, name: 'Role1' },
        { id: 2, name: 'Role2' },
        { id: 3, name: 'Role3' },
      ];

      const rejectedRoles = [];
      const id = 2;
      let error = null;

      try {
        wrapper.vm.handleGroupRoleFailure(rejectedRoles, id);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
      expect(rejectedRoles).toEqual([{ id: 2, name: 'Role2' }]);
    });
  });

  describe('Test function: openAttachUserToGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachUserToGroupDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-user-to-group',
        type: 'open',
        selectOnly: true,
      });
    });
  });

  describe('Test function: openAttachRoleToGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachRoleToGroupDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-access-control',
        type: 'open',
        selectOnly: true,
        accessControlType: 'role',
        targetAccessControlType: 'group',
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should create new group with associated user and role', async () => {
      Notify.create = vi.fn();
      wrapper.name = 'groupName';
      wrapper.selectedUsers = [{ login: 'login' }];
      wrapper.selectedRoles = [{ id: 'roleId' }];

      GroupService.create.mockImplementation(() => Promise.resolve({ id: 'groupId' }));
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.resolve());
      RoleService.associateRoleAndGroup.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining(
        { type: 'positive', message: 'AddGroupPage.text.notifySuccess' },
      ));
      expect(wrapper.vm.name).toEqual('');
      expect(wrapper.vm.selectedUsers).toEqual([]);
      expect(wrapper.vm.selectedRoles).toEqual([]);
    });

    it('should send negative notification after failing to create new group', async () => {
      Notify.create = vi.fn();
      wrapper.name = 'groupName';
      wrapper.selectedUsers = [{ login: 'login' }];
      wrapper.selectedRoles = [{ id: 'roleId' }];

      GroupService.create.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining(
        { type: 'negative', message: 'AddGroupPage.text.notifyError' },
      ));
    });
  });
});
