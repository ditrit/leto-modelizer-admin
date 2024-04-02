import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesTabPanel from 'src/components/tab-panel/RolesTabPanel.vue';
import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: RolesTabPanel', async () => {
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

    RoleService.findByLogin.mockImplementation(() => Promise.resolve(data));
    RoleService.findSubRoles.mockImplementation(() => Promise.resolve(data));
    RoleService.findByGroupId.mockImplementation(() => Promise.resolve(data));

    wrapper = shallowMount(RolesTabPanel, {
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
    it('should call attach role to role', async () => {
      await wrapper.setProps({ type: 'ROLE' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-role',
        type: 'open',
        roleId: 'id',
      });
    });

    it('should call attach role to user', async () => {
      await wrapper.setProps({ type: 'USER' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-user',
        type: 'open',
        userLogin: 'login',
      });
    });

    it('should call attach role to group', async () => {
      await wrapper.setProps({ type: 'GROUP' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-role-to-group',
        type: 'open',
        groupId: 'id',
      });
    });
  });

  describe('Test function: openDetachDialog', () => {
    it('should call detach role from role', async () => {
      await wrapper.setProps({ type: 'ROLE' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-role-from-role',
        type: 'open',
        roleToDetach: 'test',
        role: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });

    it('should call detach role from user', async () => {
      await wrapper.setProps({ type: 'USER' });
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
      });
    });

    it('should call detach role to group', async () => {
      await wrapper.setProps({ type: 'GROUP' });
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-role-from-group',
        type: 'open',
        group: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        role: 'test',
      });
    });
  });

  describe('Test function: loadRoles', () => {
    it('should load subRoles', async () => {
      await wrapper.setProps({ type: 'ROLE' });

      const result = await wrapper.vm.loadRoles({});

      expect(result).toEqual(data);
      expect(RoleService.findSubRoles).toBeCalledWith('id', {});
    });

    it('should load user roles', async () => {
      await wrapper.setProps({ type: 'USER' });

      const result = await wrapper.vm.loadRoles({});

      expect(result).toEqual(data);
      expect(RoleService.findByLogin).toBeCalledWith('login', {});
    });

    it('should load group roles', async () => {
      await wrapper.setProps({ type: 'GROUP' });

      const result = await wrapper.vm.loadRoles({});

      expect(result).toEqual(data);
      expect(RoleService.findByGroupId).toBeCalledWith('id', {});
    });
  });

  describe('Test function: getFilters', () => {
    it('should return empty filters', () => {
      wrapper.vm.roleName = '';
      wrapper.vm.currentPage = 0;
      wrapper.vm.elementsPerPage = 10;

      const result = wrapper.vm.getFilters();

      expect(result).toEqual({});
    });

    it('should return filters adapted for Role', async () => {
      await wrapper.setProps({ type: 'ROLE' });
      wrapper.vm.roleName = 'test';
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
      await wrapper.setProps({ type: 'USER' });
      wrapper.vm.roleName = 'test';
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
    it('should set roles', async () => {
      await wrapper.vm.search();

      expect(wrapper.vm.roles).toEqual(([]));
    });

    it('should set do nothing without valid entity', async () => {
      await wrapper.setProps({ type: 'ROLE', entity: {} });
      RoleService.findSubRoles.mockReset();
      await wrapper.vm.search();

      expect(wrapper.vm.roles).toEqual(([]));
      expect(RoleService.findSubRoles).not.toHaveBeenCalled();
    });

    it('should research on page out of bound', async () => {
      await wrapper.setProps({ type: 'ROLE' });
      RoleService.findSubRoles.mockReset();
      RoleService.findSubRoles.mockImplementationOnce(() => Promise.resolve({
        content: [],
        pageable: {
          pageNumber: 10,
        },
        totalPages: 1,
        size: 0,
        totalElements: 0,
      }));
      RoleService.findSubRoles.mockImplementationOnce(() => Promise.resolve({
        content: [],
        pageable: {
          pageNumber: 0,
        },
        totalPages: 1,
        size: 0,
        totalElements: 0,
      }));

      await wrapper.vm.search();

      expect(wrapper.vm.currentPage).toEqual(1);
      expect(RoleService.findSubRoles).toHaveBeenCalledTimes(2);
    });
  });
});
