import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesPage from 'pages/RolesPage.vue';
import { vi } from 'vitest';
import { useRouter } from 'vue-router';
import * as RoleService from 'src/services/RoleService';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/services/RoleService');
vi.mock('src/composables/events/DialogEvent');
vi.mock('src/composables/events/ReloadRolesEvent');

describe('Test component: RolesPage', () => {
  let wrapper;
  let push;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    push = vi.fn();
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    useRouter.mockImplementation(() => ({ push }));

    RoleService.find.mockImplementation(() => Promise.resolve({ content: 'roles' }));

    ReloadRolesEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(RolesPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToRole', () => {
    it('should redirect to role page', () => {
      wrapper.vm.goToRole('1');

      expect(push).toBeCalledWith('/roles/1');
    });
  });

  describe('Test function: openRemoveRoleDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveRoleDialog('role');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-role',
        type: 'open',
        role: 'role',
      });
    });
  });

  describe('Test function: search', () => {
    it('should set roles', () => {
      wrapper.vm.search();

      expect(wrapper.vm.roles).toEqual(('roles'));
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadRolesEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadRolesEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
