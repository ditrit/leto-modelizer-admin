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
