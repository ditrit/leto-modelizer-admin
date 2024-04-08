import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolePage from 'pages/RolePage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as RoleService from 'src/services/RoleService';
import * as PermissionService from 'src/services/PermissionService';
import { useRoute, useRouter } from 'vue-router';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.mock('src/services/PermissionService');
vi.mock('vue-router');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: RolePage', () => {
  let wrapper;
  let push;
  let reloadPermissionsSubscribe;
  let reloadPermissionsUnsubscribe;

  const role = {
    id: 1,
  };

  beforeEach(() => {
    reloadPermissionsSubscribe = vi.fn();
    reloadPermissionsUnsubscribe = vi.fn();

    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    RoleService.findById.mockImplementation(() => Promise.resolve(role));
    PermissionService.findByRoleId.mockImplementation(() => Promise.resolve({ content: 'permissions' }));

    ReloadPermissionsEvent.subscribe.mockImplementation(() => {
      reloadPermissionsSubscribe();
      return { unsubscribe: reloadPermissionsUnsubscribe };
    });

    wrapper = shallowMount(RolePage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadRole', () => {
    it('should set data on valid role', async () => {
      await wrapper.vm.loadRole();

      expect(wrapper.vm.role).toEqual(role);
    });

    it('should redirect on unknown role', async () => {
      RoleService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadRole();

      expect(push).toBeCalledWith('/roles');
    });
  });

  describe('Test function: loadPermissions', () => {
    it('should set permissions', async () => {
      await wrapper.vm.loadPermissions();

      expect(wrapper.vm.permissions).toEqual('permissions');
    });
  });

  describe('Test function: openAttachPermissionToRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachPermissionToRoleDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-permission-to-role',
        type: 'open',
        roleId: 'id1',
      });
    });
  });

  describe('Test function: openDetachPermissionFromRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openDetachPermissionFromRoleDialog('permission');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'detach-permission-from-role',
        type: 'open',
        permission: 'permission',
        role: { id: 1 },
      });
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
