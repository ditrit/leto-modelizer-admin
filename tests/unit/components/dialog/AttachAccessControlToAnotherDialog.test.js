import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachAccessControlToAnotherDialog from 'src/components/dialog/AttachAccessControlToAnotherDialog.vue';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import SelectEvent from 'src/composables/events/SelectEvent';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.mock('src/composables/events/SelectEvent');
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/ReloadRolesEvent');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachAccessControlToAnotherDialog', () => {
  let wrapper;
  let store;
  let groupData;
  let roleData;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    roleData = {
      content: ['roles'],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    groupData = {
      content: ['groups'],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    GroupService.find.mockImplementation(() => Promise.resolve(groupData));
    RoleService.find.mockImplementation(() => Promise.resolve(roleData));

    wrapper = mount(AttachAccessControlToAnotherDialog);
  });

  describe('Test computed: translationKey', () => {
    it('should be "AttachRoleToRole"', () => {
      store.permissions = null;
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'role';

      expect(wrapper.vm.translationKey).toBe('AttachRoleToRole');
    });

    it('should be "AttachRoleToGroup"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'group';

      expect(wrapper.vm.translationKey).toBe('AttachRoleToGroup');
    });

    it('should be "AttachGroupToRole"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'role';

      expect(wrapper.vm.translationKey).toBe('AttachGroupToRole');
    });

    it('should be "AttachGroupToGroup"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'group';

      expect(wrapper.vm.translationKey).toBe('AttachGroupToGroup');
    });
  });

  describe('Test function: getSuperAdministratorId', () => {
    it('should call RoleService.find with parameters to get SUPER_ADMINISTRATOR Id', async () => {
      await wrapper.vm.getSuperAdministratorId();

      expect(RoleService.find).toHaveBeenCalledWith({ name: 'SUPER_ADMINISTRATOR' });
    });
  });

  describe('Test function: loadGroups', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should call GroupService.find with correct parameters when targetAccessControlType.value is "group"', async () => {
      wrapper.vm.targetAccessControlType = 'group';
      wrapper.vm.accessControl = { id: 'exampleId' };

      await wrapper.vm.loadGroups();

      expect(GroupService.find).toHaveBeenCalledWith({ id: 'not_exampleId' });
    });

    it('should call GroupService.find without parameters when targetAccessControlType.value is not "group"', async () => {
      wrapper.vm.targetAccessControlType = 'not_group';
      wrapper.vm.accessControl = { id: 'exampleId' };

      await wrapper.vm.loadGroups();

      expect(GroupService.find).toHaveBeenCalledWith({});
    });
  });

  describe('Test function: loadRoles', () => {
    it('should call RoleService.find with correct parameters when targetAccessControlType.value is "role"', async () => {
      wrapper.vm.targetAccessControlType = 'role';
      wrapper.vm.superAdministratorId = 'superAdministratorId';

      await wrapper.vm.loadRoles();

      expect(RoleService.find).toHaveBeenCalledWith({ id: 'not_superAdministratorId' });
    });
  });

  describe('Test function: search', () => {
    it('should set rows as "groups"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.rows = [];

      await wrapper.vm.search();

      expect(wrapper.vm.rows).toEqual(['groups']);
    });

    it('should set rows as "roles"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.rows = [];

      await wrapper.vm.search();

      expect(wrapper.vm.rows).toEqual(['roles']);
    });
  });

  describe('Test function: attachAccessControl', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      wrapper.vm.accessControl = { id: 'accessControlId' };
      wrapper.vm.accessControlIdToAttach = 'accessControlIdToAttach';
    });

    it('should call GroupService.associateGroupAndGroup when accessControlType and targetAccessControlType are both "group"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'group';

      await wrapper.vm.attachAccessControl('accessControlIdToAttach');

      expect(GroupService.associateGroupAndGroup).toHaveBeenCalledWith('accessControlIdToAttach', 'accessControlId');
    });

    it('should call RoleService.associateRoleAndRole when accessControlType and targetAccessControlType are both "role"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'role';

      await wrapper.vm.attachAccessControl('accessControlIdToAttach');

      expect(RoleService.associateRoleAndRole).toHaveBeenCalledWith('accessControlId', 'accessControlIdToAttach');
    });

    it('should call RoleService.associateRoleAndGroup when accessControlType is "role" and targetAccessControlType is "group"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'group';

      await wrapper.vm.attachAccessControl('accessControlIdToAttach');

      expect(RoleService.associateRoleAndGroup).toHaveBeenCalledWith('accessControlId', 'accessControlIdToAttach');
    });

    it('should call RoleService.associateRoleAndGroup when accessControlType is "group" and targetAccessControlType is "role"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'role';

      await wrapper.vm.attachAccessControl('accessControlIdToAttach');

      expect(RoleService.associateRoleAndGroup).toHaveBeenCalledWith('accessControlIdToAttach', 'accessControlId');
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ id: '1' }, { id: '2' }];
      wrapper.vm.selectOnly = false;
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'group';
      wrapper.vm.show = true;
      wrapper.vm.submitting = false;
      store.permissions = null;

      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));
    });

    it('should send SelectRoles event', async () => {
      wrapper.vm.selectOnly = true;
      SelectEvent.SelectRolesEvent.next = vi.fn();

      await wrapper.vm.onSubmit();

      expect(SelectEvent.SelectRolesEvent.next).toHaveBeenCalled();
    });

    it('should handle successful submission', async () => {
      Notify.create = vi.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Group(s) successfully attached to the group.',
        html: true,
      });
      expect(wrapper.vm.show).toBe(false);
      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
      expect(wrapper.vm.submitting).toBe(false);
      expect(ReloadGroupsEvent.next).toHaveBeenCalled();
      expect(ReloadPermissionsEvent.next).toHaveBeenCalled();
    });

    it('should handle failed submission', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'role';
      Notify.create = vi.fn();

      RoleService.associateRoleAndRole.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Error during attachment of a role to the role.',
        html: true,
      });
      expect(ReloadRolesEvent.next).toHaveBeenCalled();
      expect(ReloadPermissionsEvent.next).toHaveBeenCalled();
    });
  });
});
