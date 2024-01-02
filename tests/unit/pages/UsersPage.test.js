import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersPage from 'pages/UsersPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/events/DialogEvent');

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

  describe('Test function: openRemoveUserDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveUserDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-user',
        type: 'open',
        user: 'test',
      });
    });
  });
});
