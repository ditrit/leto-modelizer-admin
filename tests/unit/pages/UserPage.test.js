import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserPage from 'pages/UserPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import * as UserGroupService from 'src/services/UserGroupService';
import { useRoute, useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadUserAttachedGroupsEvent from 'src/composables/events/ReloadUserAttachedGroupsEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('vue-router');
vi.mock('src/services/UserGroupService');
vi.mock('src/composables/events/ReloadUserAttachedGroupsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: UserPage', () => {
  let wrapper;
  let push;
  let subscribe;
  let unsubscribe;
  const user = {
    id: 1,
  };

  beforeEach(() => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    UserService.findById.mockImplementation(() => Promise.resolve(user));
    UserGroupService.findByUserId.mockImplementation(() => Promise.resolve(['group']));

    ReloadUserAttachedGroupsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(UserPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadUser', () => {
    it('should set data on valid user', async () => {
      wrapper.vm.user = {};
      wrapper.vm.loading = true;

      await wrapper.vm.loadUser();

      expect(wrapper.vm.user).toEqual(user);
      expect(wrapper.vm.loading).toBeFalsy();
    });

    it('should redirect on unknown user', async () => {
      UserService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUser();

      expect(push).toBeCalledWith('/users');
    });
  });

  describe('Test function: loadGroups', () => {
    it('should set userGroups', async () => {
      wrapper.vm.userGroups = [];

      await wrapper.vm.loadGroups();

      expect(wrapper.vm.userGroups).toEqual(['group']);
    });
  });

  describe('Test function: openAttachGroupToUserDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openAttachGroupToUserDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'attach-group-to-user',
        type: 'open',
        userId: 'id1',
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadUserAttachedGroupsEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadUserAttachedGroupsEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
