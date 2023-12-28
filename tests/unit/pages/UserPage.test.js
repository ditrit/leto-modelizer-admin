import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserPage from 'pages/UserPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('vue-router');

describe('Test component: UserPage', () => {
  let wrapper;
  let push;
  const user = {
    id: 1,
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    UserService.findById.mockImplementation(() => Promise.resolve(user));

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
      UserService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUser();

      expect(push).toBeCalledWith('/users');
    });
  });
});
