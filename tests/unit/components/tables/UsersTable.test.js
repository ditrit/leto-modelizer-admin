import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersTable from 'src/components/tables/UsersTable.vue';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';

installQuasarPlugin();

vi.mock('src/services/UserService');
vi.mock('src/composables/events/ReloadUsersEvent');

describe('Test component: UsersTable', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  UserService.find.mockImplementation(() => Promise.resolve([]));

  beforeEach(() => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    ReloadUsersEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(UsersTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DialogEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
