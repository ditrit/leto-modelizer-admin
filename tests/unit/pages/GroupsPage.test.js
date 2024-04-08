import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupsPage from 'pages/GroupsPage.vue';
import { useRouter, useRoute } from 'vue-router';
import { vi } from 'vitest';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as GroupService from 'src/services/GroupService';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/events/DialogEvent');
vi.mock('src/services/GroupService');
vi.mock('src/composables/events/ReloadGroupsEvent');

describe('Test component: GroupsPage', () => {
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

    GroupService.find.mockImplementation(() => Promise.resolve({
      content: ['groups'],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 1,
      size: 0,
      totalElements: 0,
    }));

    ReloadGroupsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(GroupsPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToGroup', () => {
    it('should redirect to group page', () => {
      wrapper.vm.goToGroup('1');

      expect(push).toBeCalledWith('/groups/1');
    });
  });

  describe('Test function: openRemoveGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveGroupDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-group',
        type: 'open',
        group: 'test',
      });
    });
  });

  describe('Test function: search', () => {
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(['groups']);
    });
  });

  describe('Test function: updateRoute', () => {
    it('should push routes without filters', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.groupName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/groups');
    });

    it('should push routes with size filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 11;
      wrapper.vm.groupName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/groups?size=11');
    });

    it('should push routes with current page filter', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.groupName = '';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/groups?page=2');
    });

    it('should push routes with group name filter', () => {
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.groupName = 'test';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/groups?name=test');
    });

    it('should push routes with all filters', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 11;
      wrapper.vm.groupName = 'test';

      wrapper.vm.updateRoute();

      expect(push).toBeCalledWith('/groups?size=11&page=2&name=test');
    });
  });

  describe('Test function: init', () => {
    it('should not change value without query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.groupName = 'test';

      wrapper.vm.init({});

      expect(wrapper.vm.elementsPerPage).toEqual(100);
      expect(wrapper.vm.currentPage).toEqual(200);
      expect(wrapper.vm.groupName).toEqual('test');
    });

    it('should set default value with bad query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.groupName = 'test';

      wrapper.vm.init({
        size: 'a',
        page: 'b',
      });

      expect(wrapper.vm.elementsPerPage).toEqual(10);
      expect(wrapper.vm.currentPage).toEqual(0);
      expect(wrapper.vm.groupName).toEqual('test');
    });

    it('should set value from query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.groupName = 'test';

      wrapper.vm.init({
        size: '2',
        page: '1',
        name: 'test2',
      });

      expect(wrapper.vm.elementsPerPage).toEqual(2);
      expect(wrapper.vm.currentPage).toEqual(1);
      expect(wrapper.vm.groupName).toEqual('test2');
    });
  });

  describe('Test function: getFilters', () => {
    it('should return object with no filters', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.groupName = '';

      expect({}).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with name filter', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.groupName = 'test';

      expect({ name: 'lk_*test*' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with page filter', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.groupName = '';

      expect({ page: '1' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with count filter', () => {
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 5;
      wrapper.vm.groupName = '';

      expect({ count: '5' }).toEqual(wrapper.vm.getFilters());
    });

    it('should return object with all filters', () => {
      wrapper.vm.currentPage = 2;
      wrapper.vm.elementsPerPage = 5;
      wrapper.vm.groupName = 'test';

      expect({
        count: '5',
        page: '1',
        name: 'lk_*test*',
      }).toEqual(wrapper.vm.getFilters());
    });
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
