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
    it('should set roles', async () => {
      await wrapper.vm.search();

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
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.roleName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles');
    });

    it('should push routes with size filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 11;
      wrapper.vm.roleName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?size=11');
    });

    it('should push routes with current page filter', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.roleName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?page=2');
    });

    it('should push routes with role name filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.roleName = 'test';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?name=test');
    });

    it('should push routes with all filters', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 11;
      wrapper.vm.roleName = 'test';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/roles?size=11&page=2&name=test');
    });
  });

  // describe('Test function: init', () => {
  //   it('should not change value without query parameters', () => {
  //     wrapper.vm.elementsPerPage = 100;
  //     wrapper.vm.currentPage = 200;
  //     wrapper.vm.roleName = 'test';

  //     wrapper.vm.init({});

  //     expect(wrapper.vm.elementsPerPage).toEqual(100);
  //     expect(wrapper.vm.currentPage).toEqual(200);
  //     expect(wrapper.vm.roleName).toEqual('test');
  //   });

  //   it('should set default value with bad query parameters', () => {
  //     wrapper.vm.elementsPerPage = 100;
  //     wrapper.vm.currentPage = 200;
  //     wrapper.vm.roleName = 'test';

  //     wrapper.vm.init({
  //       size: 'a',
  //       page: 'b',
  //     });

  //     expect(wrapper.vm.elementsPerPage).toEqual(10);
  //     expect(wrapper.vm.currentPage).toEqual(0);
  //     expect(wrapper.vm.roleName).toEqual('test');
  //   });

  //   it('should set value from query parameters', () => {
  //     wrapper.vm.elementsPerPage = 100;
  //     wrapper.vm.currentPage = 200;
  //     wrapper.vm.roleName = 'test';

  //     wrapper.vm.init({
  //       size: '2',
  //       page: '1',
  //       name: 'test2',
  //     });

  //     expect(wrapper.vm.elementsPerPage).toEqual(2);
  //     expect(wrapper.vm.currentPage).toEqual(1);
  //     expect(wrapper.vm.roleName).toEqual('test2');
  //   });
  // });

  // describe('Test function: getFilters', () => {
  //   it('should return object with no filters', () => {
  //     wrapper.vm.currentPage = 0;
  //     wrapper.vm.elementsPerPage = 10;
  //     wrapper.vm.roleName = '';

  //     expect({}).toEqual(wrapper.vm.getFilters());
  //   });

  //   it('should return object with name filter', () => {
  //     wrapper.vm.currentPage = 0;
  //     wrapper.vm.elementsPerPage = 10;
  //     wrapper.vm.roleName = 'test';

  //     expect({ name: 'lk_*test*' }).toEqual(wrapper.vm.getFilters());
  //   });

  //   it('should return object with page filter', () => {
  //     wrapper.vm.currentPage = 2;
  //     wrapper.vm.elementsPerPage = 10;
  //     wrapper.vm.roleName = '';

  //     expect({ page: '1' }).toEqual(wrapper.vm.getFilters());
  //   });

  //   it('should return object with count filter', () => {
  //     wrapper.vm.currentPage = 0;
  //     wrapper.vm.elementsPerPage = 5;
  //     wrapper.vm.roleName = '';

  //     expect({ count: '5' }).toEqual(wrapper.vm.getFilters());
  //   });

  //   it('should return object with all filters', () => {
  //     wrapper.vm.currentPage = 2;
  //     wrapper.vm.elementsPerPage = 5;
  //     wrapper.vm.roleName = 'test';

  //     expect({
  //       count: '5',
  //       page: '1',
  //       name: 'lk_*test*',
  //     }).toEqual(wrapper.vm.getFilters());
  //   });
  // });
});
