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

vi.mock('vue-router');
vi.mock('src/services/UserService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: UserPage', () => {
  let wrapper;
  let push;
  const user = {
    login: 'login',
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({
      params: { login: 'id1' },
      query: {
        tab: 'users',
      },
    }));
    useRouter.mockImplementation(() => ({ push }));

    UserService.findByLogin.mockImplementation(() => Promise.resolve(user));

    wrapper = shallowMount(UserPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test computed: currentTab', () => {
    it('should be "users"', () => {
      expect(wrapper.vm.currentTab).toBe('users');
    });

    it('should be "groups" when route.query.tab is undefined', () => {
      useRoute.mockImplementation(() => ({
        params: { login: 'id1' },
        query: {},
      }));

      wrapper = shallowMount(UserPage);

      expect(wrapper.vm.currentTab).toBe('groups');
    });
  });

  describe('Test function: updateUrl', () => {
    it('should update the URL with current tab query params', () => {
      wrapper.vm.tabsQuery = { groups: { page: 1 } };

      wrapper.vm.updateUrl('groups');

      expect(push).toBeCalledWith('/users/login?tab=groups&page=1');
    });
  });

  describe('Test function: setTabsQuery', () => {
    it('should set tabsQuery and call updateUrl', () => {
      wrapper.vm.tabsQuery = {
        users: {},
        groups: {},
        roles: {},
        permissions: {},
      };

      wrapper.vm.setTabsQuery('users', { page: 1 });

      expect(wrapper.vm.tabsQuery).toEqual({
        users: { page: 1 },
        groups: {},
        roles: {},
        permissions: {},
      });
      expect(push).toBeCalledWith('/users/login?tab=users&page=1');
    });
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
      UserService.findByLogin.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUser();

      expect(push).toBeCalledWith('/users');
    });
  });
});
