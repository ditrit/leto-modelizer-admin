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
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users');
    });

    it('should push users with size filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 11;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?size=11');
    });

    it('should push users with current page filter', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?page=2');
    });

    it('should push users with user name filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = 'userName';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?name=userName');
    });

    it('should push users with user login filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = 'userLogin';
      wrapper.vm.userEmail = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?login=userLogin');
    });

    it('should push users with user email filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = 'userEmail';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?email=userEmail');
    });

    it('should push users with all filters', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 11;
      wrapper.vm.userName = 'userName';
      wrapper.vm.userLogin = 'userLogin';
      wrapper.vm.userEmail = 'userEmail';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/users?size=11&page=2&name=userName&login=userLogin&email=userEmail');
    });
  });

  describe('Test function: getFilters', () => {
    it('should return object with no filters', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      expect({}).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with name filter', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = 'test';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      expect({ name: 'lk_*test*' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with login filter', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = 'test';
      wrapper.vm.userEmail = '';

      expect({ login: 'lk_*test*' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with email filter', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = 'test';

      expect({ email: 'lk_*test*' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with page filter', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      expect({ page: '1' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with count filter', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 5;
      wrapper.vm.userName = '';
      wrapper.vm.userLogin = '';
      wrapper.vm.userEmail = '';

      expect({ count: '5' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with all filters', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 5;
      wrapper.vm.userName = 'userName';
      wrapper.vm.userLogin = 'userLogin';
      wrapper.vm.userEmail = 'userEmail';

      expect({
        count: '5',
        page: '1',
        name: 'lk_*userName*',
        login: 'lk_*userLogin*',
        email: 'lk_*userEmail*',
      }).toEqual(wrapper.vm.getFilters());
    });
  });

  describe('Test function: search', () => {
    it('should set users', () => {
      wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(('users'));
    });

    it('should research on page out of bound', async () => {
      UserService.find.mockReset();
      UserService.find.mockImplementationOnce(() => Promise.resolve({
        content: 'users',
        pageable: {
          pageNumber: 10,
        },
        totalPages: 1,
        size: 0,
        totalElements: 0,
      }));
      UserService.find.mockImplementationOnce(() => Promise.resolve({
        content: 'users',
        pageable: {
          pageNumber: 0,
        },
        totalPages: 1,
        size: 0,
        totalElements: 0,
      }));

      await wrapper.vm.search();

      expect(wrapper.vm.currentPage).toEqual(1);
      expect(UserService.find).toHaveBeenCalledTimes(2);
    });
  });

  describe('Test function: init', () => {
    it('should not change value without query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.userName = 'userName';
      wrapper.vm.userLogin = 'userLogin';
      wrapper.vm.userEmail = 'userEmail';

      wrapper.vm.init({});

      expect(wrapper.vm.elementsPerPage).toEqual(100);
      expect(wrapper.vm.currentPage).toEqual(200);
      expect(wrapper.vm.userName).toEqual('userName');
      expect(wrapper.vm.userLogin).toEqual('userLogin');
      expect(wrapper.vm.userEmail).toEqual('userEmail');
    });

    it('should set default value with bad query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.userName = 'userName';
      wrapper.vm.userLogin = 'userLogin';
      wrapper.vm.userEmail = 'userEmail';

      wrapper.vm.init({
        size: 'a',
        page: 'b',
      });

      expect(wrapper.vm.elementsPerPage).toEqual(10);
      expect(wrapper.vm.currentPage).toEqual(0);
      expect(wrapper.vm.userName).toEqual('userName');
      expect(wrapper.vm.userLogin).toEqual('userLogin');
      expect(wrapper.vm.userEmail).toEqual('userEmail');
    });

    it('should set value from query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.userName = 'userName';
      wrapper.vm.userLogin = 'userLogin';
      wrapper.vm.userEmail = 'userEmail';

      wrapper.vm.init({
        size: '2',
        page: '1',
        name: 'name',
        login: 'login',
        email: 'email',
      });

      expect(wrapper.vm.elementsPerPage).toEqual(2);
      expect(wrapper.vm.currentPage).toEqual(1);
      expect(wrapper.vm.userName).toEqual('name');
      expect(wrapper.vm.userLogin).toEqual('login');
      expect(wrapper.vm.userEmail).toEqual('email');
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
