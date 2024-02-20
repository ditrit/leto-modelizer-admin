import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachRoleToUserDialog from 'src/components/dialog/AttachRoleToUserDialog.vue';
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

describe('Test component: AttachRoleToUserDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    RoleService.find.mockImplementation(() => Promise.resolve({ content: ['roles'] }));

    wrapper = mount(AttachRoleToUserDialog);
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
      wrapper.vm.userLogin = 'userLogin';
    });

    it('should send positive notification after attaching roles to user', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach roles to user', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndUser.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should update permissions for current user', async () => {
      wrapper.vm.userLogin = 'userLogin';
      store.login = 'userLogin';
      store.permissions = null;

      RoleService.associateRoleAndUser.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
