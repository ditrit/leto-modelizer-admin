import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupsTabPanel from 'src/components/tab-panel/GroupsTabPanel.vue';
import * as GroupService from 'src/services/GroupService';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: GroupsTabPanel', async () => {
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

    GroupService.findByLogin.mockImplementation(() => Promise.resolve(data));
    GroupService.findByRoleId.mockImplementation(() => Promise.resolve(data));
    GroupService.findSubGroups.mockImplementation(() => Promise.resolve(data));

    wrapper = shallowMount(GroupsTabPanel, {
      props: {
        entity: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        type: 'ROLE',
      },
    });
  });

  describe('Test function: openAttachDialog', () => {
    it('should call attach group to role', async () => {
      await wrapper.setProps({ type: 'ROLE' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-role',
        type: 'open',
        roleId: 'id',
      });
    });

    it('should call attach group to user', async () => {
      await wrapper.setProps({ type: 'USER' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-user',
        type: 'open',
        userLogin: 'login',
      });
    });

    it('should call attach group to group', async () => {
      await wrapper.setProps({ type: 'GROUP' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-group',
        type: 'open',
        groupId: 'id',
      });
    });
  });

  describe('Test function: openDetachDialog', () => {
    it('should call detach group from role', async () => {
      await wrapper.setProps({ type: 'ROLE' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-group-from-role',
        type: 'open',
        group: 'test',
        role: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });

    it('should call detach group from user', async () => {
      await wrapper.setProps({ type: 'USER' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-group-from-user',
        type: 'open',
        user: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        group: 'test',
      });
    });

    it('should call detach group from group', async () => {
      await wrapper.setProps({ type: 'GROUP' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-group-from-group',
        type: 'open',
        groupToDetach: 'test',
        group: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });
  });

  describe('Test function: loadGroups', () => {
    it('should load role groups', async () => {
      await wrapper.setProps({ type: 'ROLE' });

      const result = await wrapper.vm.loadGroups({});

      expect(result).toEqual(data);
      expect(GroupService.findByRoleId).toBeCalledWith('id', {});
    });

    it('should load user groups', async () => {
      await wrapper.setProps({ type: 'USER' });

      const result = await wrapper.vm.loadGroups({});

      expect(result).toEqual(data);
      expect(GroupService.findByLogin).toBeCalledWith('login', {});
    });

    it('should load subGroups', async () => {
      await wrapper.setProps({ type: 'GROUP' });

      const result = await wrapper.vm.loadGroups({});

      expect(result).toEqual(data);
      expect(GroupService.findSubGroups).toBeCalledWith('id', {});
    });
  });

  describe('Test function: getFilters', () => {
    it('should return empty filters', () => {
      wrapper.vm.groupName = '';
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({});
    });

    it('should return filters adapted for Group', async () => {
      await wrapper.setProps({ type: 'GROUP' });
      wrapper.vm.groupName = 'test';
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 5;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({
        parentName: 'lk_*test*',
        page: '0',
        count: '5',
      });
    });

    it('should return filters adapted for not Group', async () => {
      await wrapper.setProps({ type: 'USER' });
      wrapper.vm.groupName = 'test';
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 5;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({
        name: 'lk_*test*',
        page: '0',
        count: '5',
      });
    });
  });

  describe('Test function: checkEntity', () => {
    it('should return true on valid user entity', async () => {
      await wrapper.setProps({ type: 'USER', entity: { login: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return true on valid role entity', async () => {
      await wrapper.setProps({ type: 'ROLE', entity: { id: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return true on valid group entity', async () => {
      await wrapper.setProps({ type: 'GROUP', entity: { id: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return false on invalid user entity', async () => {
      await wrapper.setProps({ type: 'USER', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });

    it('should return false on invalid role entity', async () => {
      await wrapper.setProps({ type: 'ROLE', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });

    it('should return false on invalid group entity', async () => {
      await wrapper.setProps({ type: 'GROUP', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });
  });

  describe('Test function: search', () => {
    it('should set groups', async () => {
      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(([]));
    });

    it('should do nothing without valid entity', async () => {
      await wrapper.setProps({ type: 'GROUP', entity: {} });
      GroupService.findSubGroups.mockReset();
      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(([]));
      expect(GroupService.findSubGroups).not.toHaveBeenCalled();
    });
  });
});
