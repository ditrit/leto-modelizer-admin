import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachUserToRoleDialog from 'src/components/dialog/AttachUserToRoleDialog.vue';
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

describe('Test component: AttachUserToRoleDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    UserService.find.mockImplementation(() => Promise.resolve({ content: ['users'] }));

    wrapper = mount(AttachUserToRoleDialog);
  });

  describe('Test function: search', () => {
    it('should set users', async () => {
      wrapper.vm.users = [];

      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(['users']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ login: '1' }, { login: '2' }];
      wrapper.vm.roleId = 'roleId';
    });

    it('should send positive notification after attaching users to role', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach users to role', async () => {
      Notify.create = vi.fn();
      RoleService.associateRoleAndUser.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should update permissions for current user', async () => {
      wrapper.vm.selected = [{ login: 'userLogin' }];
      store.login = 'userLogin';
      store.permissions = null;

      RoleService.associateRoleAndUser.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
