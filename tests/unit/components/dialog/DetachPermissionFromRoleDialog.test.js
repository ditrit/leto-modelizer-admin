import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachPermissionFromRoleDialog from 'src/components/dialog/DetachPermissionFromRoleDialog.vue';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.stubGlobal('$sanitize', true);

describe('Test component: DetachPermissionFromRoleDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    wrapper = mount(DetachPermissionFromRoleDialog);

    wrapper.vm.role = {
      id: 'id',
    };
    wrapper.vm.permission = {
      id: 'id',
    };
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after detaching permission from role', async () => {
      Notify.create = vi.fn();
      RoleService.dissociateRoleAndPermission.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should update permissions', async () => {
      store.permissions = null;

      RoleService.dissociateRoleAndPermission.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
