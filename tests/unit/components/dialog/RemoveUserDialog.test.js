import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveUserDialog from 'src/components/dialog/RemoveUserDialog.vue';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/composables/UserAuthentication');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveUserDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    Notify.create = vi.fn();
    wrapper = mount(RemoveUserDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should remove user', async () => {
      wrapper.vm.user = { login: 'user1' };
      UserService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(UserService.remove).toBeCalledWith('user1');
    });

    it('should change location if removing current user', async () => {
      wrapper.vm.user = { login: 'login' };

      await wrapper.vm.onSubmit();

      expect(window.location.href).toEqual('http://localhost:3000/api/logout');
    });
  });
});
