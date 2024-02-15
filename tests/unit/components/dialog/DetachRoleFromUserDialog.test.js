import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachRoleFromUserDialog from 'src/components/dialog/DetachRoleFromUserDialog.vue';
import * as RoleService from 'src/services/RoleService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.mock('src/composables/events/DialogEvent');

vi.stubGlobal('$sanitize', true);

describe('Test component: DetachRoleFromUserDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();

    RoleService.dissociateRoleAndUser.mockImplementation(() => Promise.resolve());

    wrapper = mount(DetachRoleFromUserDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after detaching role from user', async () => {
      Notify.create = vi.fn();

      store.login = 'login';
      wrapper.vm.user = {
        login: 'id',
      };
      wrapper.vm.role = {
        id: 'id',
      };

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should not open redirect dialog if current user has admin access', async () => {
      Notify.create = vi.fn();
      DialogEvent.next.mockImplementation();

      store.login = 'id';
      wrapper.vm.user = {
        login: 'id',
      };
      wrapper.vm.role = {
        id: 'id',
      };

      UserService.getMyPermissions.mockImplementation(() => Promise.resolve([{ action: 'ACCESS', entity: 'ADMIN' }]));

      await wrapper.vm.onSubmit();

      expect(DialogEvent.next).not.toBeCalled();
    });

    it('should open redirect dialog after losing admin access to current user', async () => {
      Notify.create = vi.fn();
      DialogEvent.next.mockImplementation();

      store.login = 'id';
      wrapper.vm.user = {
        login: 'id',
      };
      wrapper.vm.role = {
        id: 'id',
      };

      UserService.getMyPermissions.mockImplementation(() => Promise.resolve([{ action: 'ACTION', entity: 'ENTITY' }]));

      await wrapper.vm.onSubmit();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'redirect',
        type: 'open',
      });
    });
  });
});
