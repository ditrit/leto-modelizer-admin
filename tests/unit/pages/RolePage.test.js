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
    useRoute.mockImplementation(() => ({
      params: { id: 'id1' },
      query: {
        tab: 'roles',
      },
    }));
    useRouter.mockImplementation(() => ({ push }));

    RoleService.findById.mockImplementation(() => Promise.resolve(role));
    wrapper = shallowMount(RolePage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test computed: currentTab', () => {
    it('should be "roles"', () => {
      expect(wrapper.vm.currentTab).toBe('roles');
    });

    it('should be "users" when route.query.tab is undefined', () => {
      useRoute.mockImplementation(() => ({
        params: { id: 'id1' },
        query: {},
      }));

      wrapper = shallowMount(RolePage);

      expect(wrapper.vm.currentTab).toBe('users');
    });
  });

  describe('Test function: updateUrl', () => {
    it('should update the URL with current tab query params', () => {
      wrapper.vm.tabsQuery = { roles: { page: 1 } };

      wrapper.vm.updateUrl('roles');

      expect(push).toBeCalledWith('/roles/1?tab=roles&page=1');
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
      expect(push).toBeCalledWith('/roles/1?tab=users&page=1');
    });
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
