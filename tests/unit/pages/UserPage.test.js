import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserPage from 'pages/UserPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import * as PermissionService from 'src/services/PermissionService';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/UserService');
vi.mock('src/services/PermissionService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: UserPage', () => {
  let wrapper;
  let push;
  const user = {
    id: 1,
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { login: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    UserService.findByLogin.mockImplementation(() => Promise.resolve(user));
    PermissionService.findByLogin.mockImplementation(() => Promise.resolve({ content: ['permission'] }));

    wrapper = shallowMount(UserPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadUser', () => {
    it('should set data on valid user', async () => {
      wrapper.vm.user = {};
      wrapper.vm.loading = true;

      await wrapper.vm.loadUser();

      expect(wrapper.vm.user).toEqual(user);
      expect(wrapper.vm.loading).toBeFalsy();
    });

    it('should redirect on unknown user', async () => {
      UserService.findByLogin.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUser();

      expect(push).toBeCalledWith('/users');
    });
  });

  describe('Test function: loadPermissions', () => {
    it('should set permissions', async () => {
      wrapper.vm.permissions = [];

      await wrapper.vm.loadPermissions();

      expect(wrapper.vm.permissions).toEqual(['permission']);
    });
  });
});
