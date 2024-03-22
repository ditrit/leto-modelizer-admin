import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesPage from 'pages/RolesPage.vue';
import { vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';
import * as RoleService from 'src/services/RoleService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/services/RoleService');
vi.mock('src/composables/events/DialogEvent');
vi.mock('src/composables/events/ReloadRolesEvent');

describe('Test component: RolesPage', () => {
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

    RoleService.find.mockImplementation(() => Promise.resolve({
      content: 'roles',
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 0,
      totalElements: 0,
    }));

    ReloadRolesEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(RolesPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToRole', () => {
    it('should redirect to role page', () => {
      wrapper.vm.goToRole('1');

      expect(push).toBeCalledWith('/roles/1');
    });
  });

  describe('Test function: openRemoveRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveRoleDialog('role');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-role',
        type: 'open',
        role: 'role',
      });
    });
  });

  describe('Test function: search', () => {
    it('should set roles', () => {
      wrapper.vm.search();

      expect(wrapper.vm.roles).toEqual(('roles'));
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadRolesEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadRolesEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test function: updateRoute', () => {
    it('should push routes without filters', () => {
      wrapper.vm.paginationCurrent = 1;
      wrapper.vm.paginationSize = 10;
      wrapper.vm.filterRoleName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles');
    });

    it('should push routes with size filter', () => {
      wrapper.vm.paginationCurrent = 1;
      wrapper.vm.paginationSize = 11;
      wrapper.vm.filterRoleName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?size=11');
    });

    it('should push routes with current page filter', () => {
      wrapper.vm.paginationCurrent = 2;
      wrapper.vm.paginationSize = 10;
      wrapper.vm.filterRoleName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?page=2');
    });

    it('should push routes with role name filter', () => {
      wrapper.vm.paginationCurrent = 1;
      wrapper.vm.paginationSize = 10;
      wrapper.vm.filterRoleName = 'test';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?name=test');
    });

    it('should push routes with all filters', () => {
      wrapper.vm.paginationCurrent = 2;
      wrapper.vm.paginationSize = 11;
      wrapper.vm.filterRoleName = 'test';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?size=11&page=2&name=test');
    });
  });

  describe('Test function: searchByName', () => {
    it('should set filterRoleName', () => {
      wrapper.vm.filterRoleName = '';
      wrapper.vm.searchByName('test');
      expect(wrapper.vm.filterRoleName).toEqual('test');
    });
  });

  describe('Test function: updatePage', () => {
    it('should set paginationCurrent', () => {
      wrapper.vm.paginationCurrent = 1;
      wrapper.vm.updatePage(2);
      expect(wrapper.vm.paginationCurrent).toEqual(2);
    });
  });

  describe('Test function: updateSize', () => {
    it('should set paginationSize', () => {
      wrapper.vm.paginationSize = 10;
      wrapper.vm.updateSize(11);
      expect(wrapper.vm.paginationSize).toEqual(11);
    });
  });

  describe('Test function: init', () => {
    it('should not change on no query parameters', () => {
      wrapper.vm.paginationCurrent = 2;
      wrapper.vm.paginationSize = 12;
      wrapper.vm.filterRoleName = 'test';

      wrapper.vm.init();

      expect(wrapper.vm.paginationCurrent).toEqual(2);
      expect(wrapper.vm.paginationSize).toEqual(12);
      expect(wrapper.vm.filterRoleName).toEqual('test');
    });

    it('should change with query parameters', () => {
      useRoute.mockImplementation(() => ({
        query: {
          size: 15,
          page: 3,
          name: 'test1',
        },
      }));
      wrapper = shallowMount(RolesPage);

      wrapper.vm.paginationCurrent = 2;
      wrapper.vm.paginationSize = 12;
      wrapper.vm.filterRoleName = 'test';

      wrapper.vm.init();

      expect(wrapper.vm.paginationCurrent).toEqual(3);
      expect(wrapper.vm.paginationSize).toEqual(15);
      expect(wrapper.vm.filterRoleName).toEqual('test1');
    });
  });
});
