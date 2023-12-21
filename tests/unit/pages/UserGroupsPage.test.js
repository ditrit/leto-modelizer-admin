import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsPage from 'pages/UserGroupsPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('vue-router');

describe('Test component: UserGroupsPage', () => {
  let wrapper;
  let push;

  beforeEach(() => {
    push = vi.fn();
    useRouter.mockImplementation(() => ({ push }));

    wrapper = shallowMount(UserGroupsPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToUserGroup', () => {
    it('should redirect to userGroup page', () => {
      wrapper.vm.goToUserGroup('1');

      expect(push).toBeCalledWith('/user-groups/1');
    });
  });
});
