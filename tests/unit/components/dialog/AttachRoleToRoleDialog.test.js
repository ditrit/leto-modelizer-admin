import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachRoleToRoleDialog from 'src/components/dialog/AttachRoleToRoleDialog.vue';
import * as UserService from 'src/services/UserService';
import * as RoleService from 'src/services/RoleService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/services/RoleService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachRoleToRoleDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    RoleService.find.mockImplementation(() => Promise.resolve({ content: ['roles'] }));

    wrapper = mount(AttachRoleToRoleDialog);
  });

  describe('Test function: search', () => {
    it('should set roles', async () => {
      wrapper.vm.roles = [];

      await wrapper.vm.search();

      expect(wrapper.vm.roles).toEqual(['roles']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ id: '1' }, { id: '2' }];
      wrapper.vm.roleId = 'roleId';
    });

    it('should send positive notification after attaching roles to role', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndRole.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach roles to role', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndRole.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should update permissions', async () => {
      store.permissions = null;

      RoleService.associateRoleAndGroup.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
