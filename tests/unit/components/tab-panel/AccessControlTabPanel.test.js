import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import AccessControlTabPanel from 'src/components/tab-panel/AccessControlTabPanel.vue';
import * as GroupService from 'src/services/GroupService';
import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import { useRoute } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/GroupService');
vi.mock('src/services/RoleService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: AccessControlTabPanel', async () => {
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
    RoleService.findByLogin.mockImplementation(() => Promise.resolve(data));
    RoleService.findByGroupId.mockImplementation(() => Promise.resolve(data));
    RoleService.findSubRoles.mockImplementation(() => Promise.resolve(data));

    useRoute.mockImplementation(() => ({
      query: {},
    }));

    wrapper = shallowMount(AccessControlTabPanel, {
      props: {
        entity: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        type: 'role',
        subType: 'role',
      },
    });
  });

  describe('Test computed: translationKey', () => {
    it('should be "Role" when type is "role"', () => {
      expect(wrapper.vm.translationKey).toBe('Role');
    });

    it('should be "Group" when type is "group"', async () => {
      await wrapper.setProps({
        type: 'group',
      });

      expect(wrapper.vm.translationKey).toBe('Group');
    });
  });

  describe('Test function: openAttachDialog', () => {
    it('should call attach role to role', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-access-control',
        type: 'open',
        accessControlType: 'role',
        targetAccessControlType: 'role',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });

    it('should call attach role to group', async () => {
      await wrapper.setProps({ subType: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-access-control',
        type: 'open',
        accessControlType: 'role',
        targetAccessControlType: 'group',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });

    it('should call attach role to user', async () => {
      await wrapper.setProps({ subType: 'user' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-user',
        type: 'open',
        userLogin: 'login',
      });
    });

    it('should call attach group to role', async () => {
      await wrapper.setProps({ subType: 'role', type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-access-control',
        type: 'open',
        accessControlType: 'group',
        targetAccessControlType: 'role',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });

    it('should call attach group to user', async () => {
      await wrapper.setProps({ subType: 'user', type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-user',
        type: 'open',
        userLogin: 'login',
      });
    });

    it('should call attach group to group', async () => {
      await wrapper.setProps({ subType: 'group', type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-access-control',
        type: 'open',
        accessControlType: 'group',
        targetAccessControlType: 'group',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });
  });

  describe('Test function: openDetachDialog', () => {
    it('should call detach role from role', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-access-control',
        type: 'open',
        targetAccessControl: 'test',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        accessControlType: 'role',
        targetAccessControlType: 'role',
      });
    });

    it('should call detach role from user', async () => {
      await wrapper.setProps({ subType: 'user' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-role-from-user',
        type: 'open',
        user: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        role: 'test',
        group: 'test',
      });
    });

    it('should call detach role from group', async () => {
      await wrapper.setProps({ subType: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-access-control',
        type: 'open',
        targetAccessControl: 'test',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        accessControlType: 'role',
        targetAccessControlType: 'group',
      });
    });

    it('should call detach group from role', async () => {
      await wrapper.setProps({ subType: 'role', type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-access-control',
        type: 'open',
        targetAccessControl: 'test',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        accessControlType: 'group',
        targetAccessControlType: 'role',
      });
    });

    it('should call detach group from user', async () => {
      await wrapper.setProps({ subType: 'user', type: 'group' });
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
        role: 'test',
        group: 'test',
      });
    });

    it('should call detach group from group', async () => {
      await wrapper.setProps({ subType: 'group', type: 'group' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-access-control',
        type: 'open',
        accessControl: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        targetAccessControl: 'test',
        accessControlType: 'group',
        targetAccessControlType: 'group',
      });
    });
  });

  describe('Test function: loadGroups', () => {
    it('should load role groups', async () => {
      await wrapper.setProps({ subType: 'role' });

      const result = await wrapper.vm.loadGroups({});

      expect(result).toEqual(data);
      expect(GroupService.findByRoleId).toBeCalledWith('id', {});
    });

    it('should load user groups', async () => {
      await wrapper.setProps({ subType: 'user' });

      const result = await wrapper.vm.loadGroups({});

      expect(result).toEqual(data);
      expect(GroupService.findByLogin).toBeCalledWith('login', {});
    });

    it('should load subGroups', async () => {
      await wrapper.setProps({ subType: 'group' });

      const result = await wrapper.vm.loadGroups({});

      expect(result).toEqual(data);
      expect(GroupService.findSubGroups).toBeCalledWith('id', {});
    });
  });

  describe('Test function: loadRoles', () => {
    it('should load subRoles', async () => {
      await wrapper.setProps({ subType: 'role' });

      const result = await wrapper.vm.loadRoles({});

      expect(result).toEqual(data);
      expect(RoleService.findSubRoles).toBeCalledWith('id', {});
    });

    it('should load user roles', async () => {
      await wrapper.setProps({ subType: 'user' });

      const result = await wrapper.vm.loadRoles({});

      expect(result).toEqual(data);
      expect(RoleService.findByLogin).toBeCalledWith('login', {});
    });

    it('should load group roles', async () => {
      await wrapper.setProps({ subType: 'group' });

      const result = await wrapper.vm.loadRoles({});

      expect(result).toEqual(data);
      expect(RoleService.findByGroupId).toBeCalledWith('id', {});
    });
  });

  describe('Test function: checkEntity', () => {
    it('should return true on valid user entity', async () => {
      await wrapper.setProps({ subType: 'user', entity: { login: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return true on valid role entity', async () => {
      await wrapper.setProps({ subType: 'role', entity: { id: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return true on valid group entity', async () => {
      await wrapper.setProps({ subType: 'group', entity: { id: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return false on invalid user entity', async () => {
      await wrapper.setProps({ subType: 'user', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });

    it('should return false on invalid role entity', async () => {
      await wrapper.setProps({ subType: 'role', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });

    it('should return false on invalid group entity', async () => {
      await wrapper.setProps({ subType: 'group', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });
  });

  describe('Test function: getFilters', () => {
    it('should return empty filters', () => {
      wrapper.vm.name = '';
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({});
    });

    it('should return filters adapted for Role', async () => {
      await wrapper.setProps({ subType: 'role' });
      wrapper.vm.name = 'test';
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 5;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({
        parentName: 'lk_*test*',
        page: '0',
        count: '5',
      });
    });

    it('should return filters adapted for Group', async () => {
      await wrapper.setProps({ subType: 'group' });
      wrapper.vm.name = 'test';
      wrapper.vm.currentPage = 1;
      wrapper.vm.elementsPerPage = 5;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({
        parentName: 'lk_*test*',
        page: '0',
        count: '5',
      });
    });

    it('should return filters adapted for not Role', async () => {
      await wrapper.setProps({ subType: 'user' });
      wrapper.vm.name = 'test';
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

  describe('Test function: emitQuery', () => {
    it('should emit the correct query parameters', () => {
      wrapper.vm.elementsPerPage = 20;
      wrapper.vm.currentPage = 2;
      wrapper.vm.name = 'Test';

      wrapper.vm.emitQuery();

      expect(wrapper.emitted()).toEqual({
        'update:access-control-query': [[{ size: 20, page: 2, name: 'Test' }]],
      });
    });

    it('should not emit any query parameters when all conditions are not met', () => {
      wrapper.vm.elementsPerPage = 10;
      wrapper.vm.currentPage = 1;
      wrapper.vm.name = '';

      wrapper.vm.emitQuery();

      expect(wrapper.emitted()).toEqual({
        'update:access-control-query': [[{ }]],
      });
    });
  });

  describe('Test function: init', () => {
    it('should not change value without query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.name = 'test';

      wrapper.vm.init({});

      expect(wrapper.vm.elementsPerPage).toEqual(100);
      expect(wrapper.vm.currentPage).toEqual(200);
      expect(wrapper.vm.name).toEqual('test');
    });

    it('should set default value with bad query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.name = 'test';

      wrapper.vm.init({
        size: 'a',
        page: 'b',
      });

      expect(wrapper.vm.elementsPerPage).toEqual(10);
      expect(wrapper.vm.currentPage).toEqual(0);
      expect(wrapper.vm.name).toEqual('test');
    });

    it('should set value from query parameters', () => {
      wrapper.vm.elementsPerPage = 100;
      wrapper.vm.currentPage = 200;
      wrapper.vm.name = 'test';

      wrapper.vm.init({
        size: '2',
        page: '1',
        name: 'test2',
      });

      expect(wrapper.vm.elementsPerPage).toEqual(2);
      expect(wrapper.vm.currentPage).toEqual(1);
      expect(wrapper.vm.name).toEqual('test2');
    });
  });

  describe('Test function: search', () => {
    it('should set rows', async () => {
      await wrapper.vm.search();

      expect(wrapper.vm.rows).toEqual(([]));
    });

    it('should do nothing without valid entity', async () => {
      await wrapper.setProps({ subType: 'group', type: 'group', entity: {} });
      GroupService.findSubGroups.mockReset();
      await wrapper.vm.search();

      expect(wrapper.vm.rows).toEqual(([]));
      expect(GroupService.findSubGroups).not.toHaveBeenCalled();
    });
  });
});
