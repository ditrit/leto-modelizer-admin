import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersPage from 'pages/UsersPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/events/DialogEvent');
vi.mock('src/composables/events/ReloadUsersEvent');
vi.mock('src/services/UserService');

describe('Test component: UsersPage', () => {
  let wrapper;
  let push;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    push = vi.fn();
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    useRouter.mockImplementation(() => ({ push }));

    UserService.find.mockImplementation(() => Promise.resolve('users'));

    ReloadUsersEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

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

  describe('Test function: search', () => {
    it('should set users', () => {
      wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(('users'));
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadUsersEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadUsersEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
