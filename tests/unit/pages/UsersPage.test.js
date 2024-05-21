import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersPage from 'pages/UsersPage.vue';
import { useRouter, useRoute } from 'vue-router';
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
    useRoute.mockImplementation(() => ({
      query: {},
    }));

    UserService.find.mockImplementation(() => Promise.resolve({
      content: 'users',
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 0,
      totalElements: 0,
    }));

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

  describe('Test function: updateRoute', () => {
    it('should push users without filters', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: '',
        login: '',
        email: '',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users');
    });

    it('should push users with size filter', () => {
      wrapper.vm.filters = {
        count: 11,
        page: 1,
        name: '',
        login: '',
        email: '',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?size=11');
    });

    it('should push users with current page filter', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 2,
        name: '',
        login: '',
        email: '',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?page=2');
    });

    it('should push users with user name filter', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: 'userName',
        login: '',
        email: '',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?name=userName');
    });

    it('should push users with user login filter', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: '',
        login: 'userLogin',
        email: '',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?login=userLogin');
    });

    it('should push users with user email filter', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: '',
        login: '',
        email: 'userEmail',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?email=userEmail');
    });

    it('should push users with all filters', () => {
      wrapper.vm.filters = {
        count: 11,
        page: 2,
        name: 'userName',
        login: 'userLogin',
        email: 'userEmail',
      };

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?size=11&page=2&name=userName&login=userLogin&email=userEmail');
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
