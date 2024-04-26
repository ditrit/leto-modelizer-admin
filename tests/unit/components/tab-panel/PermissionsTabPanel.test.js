import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import PermissionsTabPanel from 'src/components/tab-panel/PermissionsTabPanel.vue';
import * as PermissionService from 'src/services/PermissionService';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import { useRoute } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/PermissionService');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: PermissionsTabPanel', async () => {
  let wrapper;
  let data;
  let reloadPermissionsSubscribe;
  let reloadPermissionsUnsubscribe;

  beforeEach(async () => {
    reloadPermissionsSubscribe = vi.fn();
    reloadPermissionsUnsubscribe = vi.fn();

    data = {
      content: [],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    ReloadPermissionsEvent.subscribe.mockImplementation(() => {
      reloadPermissionsSubscribe();
      return { unsubscribe: reloadPermissionsUnsubscribe };
    });

    PermissionService.findByRoleId.mockImplementation(() => Promise.resolve(data));
    PermissionService.findByLogin.mockImplementation(() => Promise.resolve(data));
    PermissionService.findByGroupId.mockImplementation(() => Promise.resolve(data));

    useRoute.mockImplementation(() => ({
      query: {},
    }));

    wrapper = shallowMount(PermissionsTabPanel, {
      props: {
        isSuperAdmin: false,
        entity: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
        type: 'role',
      },
    });
  });

  describe('Test computed: showAttachDetachButton', () => {
    it('should return true when isSuperAdmin is false and type is "role"', () => {
      expect(wrapper.vm.showAttachDetachButton).toBe(true);
    });

    it('should return false when isSuperAdmin is true and type is "role"', async () => {
      await wrapper.setProps({ isSuperAdmin: true, type: 'role' });

      expect(wrapper.vm.showAttachDetachButton).toBe(false);
    });

    it('should return false when isSuperAdmin is true and type is not "role"', async () => {
      await wrapper.setProps({ isSuperAdmin: true, type: 'not_role' });

      expect(wrapper.vm.showAttachDetachButton).toBe(false);
    });

    it('should return false when isSuperAdmin is false and type is not "role"', async () => {
      await wrapper.setProps({ isSuperAdmin: false, type: 'not_role' });

      expect(wrapper.vm.showAttachDetachButton).toBe(false);
    });
  });

  describe('Test function: openAttachDialog', () => {
    it('should call attach permission to role', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAttachDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-permission-to-role',
        type: 'open',
        roleId: 'id',
      });
    });
  });

  describe('Test function: openDetachDialog', () => {
    it('should call detach permission from role', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openDetachDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-permission-from-role',
        type: 'open',
        permission: 'test',
        role: {
          id: 'id',
          name: 'test',
          login: 'login',
        },
      });
    });
  });

  describe('Test function: loadPermissions', () => {
    it('should load role permissions', async () => {
      const result = await wrapper.vm.loadPermissions({});

      expect(result).toEqual(data);
      expect(PermissionService.findByRoleId).toBeCalledWith('id', {});
    });

    it('should load group permissions', async () => {
      await wrapper.setProps({ type: 'group' });

      const result = await wrapper.vm.loadPermissions({});

      expect(result).toEqual(data);
      expect(PermissionService.findByGroupId).toBeCalledWith('id', {});
    });

    it('should load user permissions', async () => {
      await wrapper.setProps({ type: 'user' });

      const result = await wrapper.vm.loadPermissions({});

      expect(result).toEqual(data);
      expect(PermissionService.findByLogin).toBeCalledWith('login', {});
    });
  });

  describe('Test function: checkEntity', () => {
    it('should return true on valid user entity', async () => {
      await wrapper.setProps({ type: 'user', entity: { login: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return true on valid role entity', async () => {
      await wrapper.setProps({ type: 'role', entity: { id: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return true on valid group entity', async () => {
      await wrapper.setProps({ type: 'group', entity: { id: 'test' } });
      expect(wrapper.vm.checkEntity()).toBeTruthy();
    });

    it('should return false on invalid user entity', async () => {
      await wrapper.setProps({ type: 'user', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });

    it('should return false on invalid role entity', async () => {
      await wrapper.setProps({ type: 'role', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });

    it('should return false on invalid group entity', async () => {
      await wrapper.setProps({ type: 'group', entity: {} });
      expect(wrapper.vm.checkEntity()).toBeFalsy();
    });
  });

  describe('Test function: search', () => {
    it('should set permissions', async () => {
      await wrapper.vm.search();

      expect(wrapper.vm.permissions).toEqual(([]));
    });

    it('should do nothing without valid entity', async () => {
      await wrapper.setProps({ type: 'role', entity: {} });
      PermissionService.findByRoleId.mockReset();
      await wrapper.vm.search();

      expect(wrapper.vm.permissions).toEqual(([]));
      expect(PermissionService.findByRoleId).not.toHaveBeenCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadPermissionsEvent', () => {
      expect(reloadPermissionsSubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadPermissionsEvent', () => {
      expect(reloadPermissionsUnsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(reloadPermissionsUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
