import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachPermissionToRoleDialog from 'src/components/dialog/AttachPermissionToRoleDialog.vue';
import * as UserService from 'src/services/UserService';
import * as RoleService from 'src/services/RoleService';
import * as PermissionService from 'src/services/PermissionService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/services/RoleService');
vi.mock('src/services/PermissionService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachPermissionToRoleDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    PermissionService.find.mockImplementation(() => Promise.resolve({ content: ['permissions'] }));

    wrapper = mount(AttachPermissionToRoleDialog);
  });

  describe('Test function: search', () => {
    it('should set permissions', async () => {
      wrapper.vm.permissions = [];

      await wrapper.vm.search();

      expect(wrapper.vm.permissions).toEqual(['permissions']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ id: '1' }, { id: '2' }];
      wrapper.vm.roleId = 'roleId';
    });

    it('should send positive notification after attaching permissions to role', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndPermission.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach permissions to role', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndPermission.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should update permissions', async () => {
      store.permissions = null;

      RoleService.associateRoleAndPermission.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
