import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachAccessControlFromAnotherDialog from 'src/components/dialog/DetachAccessControlFromAnotherDialog.vue';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
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
vi.mock('src/composables/events/ReloadGroupsEvent');
vi.mock('src/composables/events/ReloadRolesEvent');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.stubGlobal('$sanitize', true);

describe('Test component: DetachAccessControlFromAnotherDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    wrapper = mount(DetachAccessControlFromAnotherDialog);
  });

  describe('Test computed: translationKey', () => {
    it('should be "DetachRoleFromRole"', () => {
      store.permissions = null;
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'role';

      expect(wrapper.vm.translationKey).toBe('DetachRoleFromRole');
    });

    it('should be "DetachRoleFromGroup"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'group';

      expect(wrapper.vm.translationKey).toBe('DetachRoleFromGroup');
    });

    it('should be "DetachGroupFromRole"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'role';

      expect(wrapper.vm.translationKey).toBe('DetachGroupFromRole');
    });

    it('should be "DetachGroupFromGroup"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'group';

      expect(wrapper.vm.translationKey).toBe('DetachGroupFromGroup');
    });
  });

  describe('Test function: detachAccessControl', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      wrapper.vm.accessControl = { id: 'accessControlId' };
      wrapper.vm.targetAccessControl = { id: 'targetAccessControlId' };
    });

    it('should call GroupService.dissociateGroupAndGroup when accessControlType and targetAccessControlType are both "group"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'group';

      await wrapper.vm.detachAccessControl();

      expect(GroupService.dissociateGroupAndGroup).toHaveBeenCalledWith('targetAccessControlId', 'accessControlId');
    });

    it('should call RoleService.dissociateRoleAndRole when accessControlType and targetAccessControlType are both "role"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'role';

      await wrapper.vm.detachAccessControl();

      expect(RoleService.dissociateRoleAndRole).toHaveBeenCalledWith('accessControlId', 'targetAccessControlId');
    });

    it('should call RoleService.dissociateRoleAndGroup when accessControlType is "role" and targetAccessControlType is "group"', async () => {
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'group';

      await wrapper.vm.detachAccessControl();

      expect(RoleService.dissociateRoleAndGroup).toHaveBeenCalledWith('accessControlId', 'targetAccessControlId');
    });

    it('should call RoleService.dissociateRoleAndGroup when accessControlType is "group" and targetAccessControlType is "role"', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'role';

      await wrapper.vm.detachAccessControl();

      expect(RoleService.dissociateRoleAndGroup).toHaveBeenCalledWith('targetAccessControlId', 'accessControlId');
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      wrapper.vm.accessControlType = 'role';
      wrapper.vm.targetAccessControlType = 'role';
      RoleService.dissociateRoleAndRole.mockImplementation(() => Promise.resolve());
    });

    it('should send positive notification after detaching role from role', async () => {
      Notify.create = vi.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(ReloadRolesEvent.next).toHaveBeenCalled();
      expect(ReloadPermissionsEvent.next).toHaveBeenCalled();
    });

    it('should send positive notification after detaching group from group', async () => {
      wrapper.vm.accessControlType = 'group';
      wrapper.vm.targetAccessControlType = 'group';
      Notify.create = vi.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(ReloadGroupsEvent.next).toHaveBeenCalled();
      expect(ReloadPermissionsEvent.next).toHaveBeenCalled();
    });

    it('should update user permissions', async () => {
      store.permissions = null;

      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
