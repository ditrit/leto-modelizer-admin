import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachRoleFromRoleDialog from 'src/components/dialog/DetachRoleFromRoleDialog.vue';
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

describe('Test component: DetachRoleFromRoleDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    wrapper = mount(DetachRoleFromRoleDialog);

    wrapper.vm.roleToDetach = {
      id: 'roleIdToDetach',
    };
    wrapper.vm.role = {
      id: 'roleId',
    };
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after detaching role from role', async () => {
      Notify.create = vi.fn();

      RoleService.dissociateRoleAndRole.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should update user permissions', async () => {
      store.permissions = null;

      RoleService.dissociateRoleAndRole.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
