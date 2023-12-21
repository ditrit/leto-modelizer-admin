import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupPage from 'pages/UserGroupPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as UserGroupService from 'src/services/UserGroupService';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserGroupService');
vi.mock('vue-router');

describe('Test component: UserGroupPage', () => {
  let wrapper;
  let push;
  const userGroup = {
    id: 1,
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    UserGroupService.findById.mockImplementation(() => Promise.resolve(userGroup));

    wrapper = shallowMount(UserGroupPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadUserGroup', () => {
    it('should set data on valid userGroup', async () => {
      wrapper.vm.userGroup = {};
      wrapper.vm.loading = true;

      await wrapper.vm.loadUserGroup();

      expect(wrapper.vm.userGroup).toEqual(userGroup);
      expect(wrapper.vm.loading).toBeFalsy();
    });

    it('should redirect on unknown userGroup', async () => {
      UserGroupService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUserGroup();

      expect(push).toBeCalledWith('/user-groups');
    });
  });
});
