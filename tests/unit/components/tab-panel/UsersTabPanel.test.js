import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersTabPanel from 'src/components/tab-panel/UsersTabPanel.vue';
import * as UserService from 'src/services/UserService';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import { useRoute } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/UserService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: UsersTabPanel', async () => {
  let wrapper;
  let data;

  beforeEach(async () => {
    data = {
      content: [],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    UserService.findByRoleId.mockImplementation(() => Promise.resolve(data));
    UserService.findByGroupId.mockImplementation(() => Promise.resolve(data));

    useRoute.mockImplementation(() => ({
      query: {},
    }));

    wrapper = shallowMount(UsersTabPanel, {
      props: {
        entity: {
          id: 'id',
          name: 'test',
        },
        type: 'role',
      },
    });
  });

  describe('Test function: openAttachDialog', () => {
    it('should call attach user to role', async () => {
      await wrapper.setProps({ type: 'role' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-user-to-role',
        type: 'open',
        roleId: 'id',
      });
    });

    it('should call attach user to group', async () => {
      await wrapper.setProps({ type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-user-to-group',
        type: 'open',
        groupId: 'id',
      });
    });
  });

  describe('Test function: openDetachDialog', () => {
    it('should call detach user from role', async () => {
      await wrapper.setProps({ type: 'role' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-user-from-role',
        type: 'open',
        user: 'test',
        role: {
          id: 'id',
          name: 'test',
        },
      });
    });

    it('should call detach user from group', async () => {
      await wrapper.setProps({ type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-user-from-group',
        type: 'open',
        user: 'test',
        group: {
          id: 'id',
          name: 'test',
        },
      });
    });
  });

  describe('Test function: loadUsers', () => {
    it('should load subRoles', async () => {
      await wrapper.setProps({ type: 'role' });

      const result = await wrapper.vm.loadUsers({});

      expect(result).toEqual(data);
      expect(UserService.findByRoleId).toBeCalledWith('id', {});
    });

    it('should load group roles', async () => {
      await wrapper.setProps({ type: 'group' });

      const result = await wrapper.vm.loadUsers({});

      expect(result).toEqual(data);
      expect(UserService.findByGroupId).toBeCalledWith('id', {});
    });
  });

  describe('Test function: search', () => {
    it('should set users', async () => {
      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(([]));
    });

    it('should do nothing without valid entity', async () => {
      await wrapper.setProps({ type: 'role', entity: {} });
      UserService.findByRoleId.mockReset();
      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(([]));
      expect(UserService.findByRoleId).not.toHaveBeenCalled();
    });
  });
});
