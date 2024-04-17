import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolePage from 'pages/RolePage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as RoleService from 'src/services/RoleService';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.mock('vue-router');

describe('Test component: RolePage', () => {
  let wrapper;
  let push;

  const role = {
    id: 1,
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    RoleService.findById.mockImplementation(() => Promise.resolve(role));
    wrapper = shallowMount(RolePage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadRole', () => {
    it('should set data on valid role', async () => {
      await wrapper.vm.loadRole();

      expect(wrapper.vm.role).toEqual(role);
    });

    it('should redirect on unknown role', async () => {
      RoleService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadRole();

      expect(push).toBeCalledWith('/roles');
    });
  });
});
