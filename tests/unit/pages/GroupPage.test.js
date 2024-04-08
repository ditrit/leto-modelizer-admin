import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupPage from 'pages/GroupPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as GroupService from 'src/services/GroupService';
import * as PermissionService from 'src/services/PermissionService';
import { useRoute, useRouter } from 'vue-router';
import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('src/services/PermissionService');
vi.mock('vue-router');
vi.mock('src/composables/events/ReloadPermissionsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: GroupPage', () => {
  let wrapper;
  let push;
  let reloadPermissionsSubscribe;
  let reloadPermissionsUnsubscribe;

  const group = {
    id: 1,
  };

  beforeEach(() => {
    reloadPermissionsSubscribe = vi.fn();
    reloadPermissionsUnsubscribe = vi.fn();

    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    GroupService.findById.mockImplementation(() => Promise.resolve(group));
    GroupService.findSubGroups.mockImplementation(() => Promise.resolve({ content: 'groups' }));
    PermissionService.findByGroupId.mockImplementation(() => Promise.resolve({ content: 'permissions' }));

    ReloadPermissionsEvent.subscribe.mockImplementation(() => {
      reloadPermissionsSubscribe();
      return { unsubscribe: reloadPermissionsUnsubscribe };
    });

    wrapper = shallowMount(GroupPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadGroup', () => {
    it('should set data on valid group', async () => {
      await wrapper.vm.loadGroup();

      expect(wrapper.vm.group).toEqual(group);
    });

    it('should redirect on unknown group', async () => {
      GroupService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadGroup();

      expect(push).toBeCalledWith('/groups');
    });
  });

  describe('Test function: loadPermissions', () => {
    it('should set permissions', async () => {
      await wrapper.vm.loadPermissions();

      expect(wrapper.vm.permissions).toEqual('permissions');
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
