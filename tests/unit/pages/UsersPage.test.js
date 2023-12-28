import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersPage from 'pages/UsersPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('vue-router');

describe('Test component: UsersPage', () => {
  let wrapper;
  let push;

  beforeEach(() => {
    push = vi.fn();
    useRouter.mockImplementation(() => ({ push }));

    wrapper = shallowMount(UsersPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToUser', () => {
    it('should redirect to user page', () => {
      wrapper.vm.goToUser('1');

      expect(push).toBeCalledWith('/users/1');
    });
  });
});
