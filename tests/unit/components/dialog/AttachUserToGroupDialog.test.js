import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachUserToGroupDialog from 'src/components/dialog/AttachUserToGroupDialog.vue';
import * as UserService from 'src/services/UserService';
import * as GroupService from 'src/services/GroupService';
import SelectEvent from 'src/composables/events/SelectEvent';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/services/GroupService');
vi.mock('src/composables/events/SelectEvent');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachUserToGroupDialog', () => {
  let wrapper;
  let store;
  let data;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    data = {
      content: ['users'],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    UserService.find.mockImplementation(() => Promise.resolve(data));

    wrapper = mount(AttachUserToGroupDialog);
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
    it('should set users', async () => {
      wrapper.vm.users = [];

      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(['users']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ login: '1' }, { login: '2' }];
      wrapper.vm.groupId = 'groupId';
    });

    it('should send SelectRoles event', async () => {
      wrapper.vm.selectOnly = true;
      SelectEvent.SelectUsersEvent.next = vi.fn();

      await wrapper.vm.onSubmit();

      expect(SelectEvent.SelectUsersEvent.next).toHaveBeenCalled();
    });

    it('should send positive notification after attaching users to group', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach users to group', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should update permissions for current user', async () => {
      wrapper.vm.selected = [{ login: 'userLogin' }];
      store.login = 'userLogin';
      store.permissions = null;

      GroupService.associateGroupAndUser.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
