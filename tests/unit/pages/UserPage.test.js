import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserPage from 'pages/UserPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';
import * as GroupService from 'src/services/GroupService';
import { useRoute, useRouter } from 'vue-router';
import DialogEvent from 'src/composables/events/DialogEvent';
import ReloadUserGroupsEvent from 'src/composables/events/ReloadUserGroupsEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('vue-router');
vi.mock('src/services/GroupService');
vi.mock('src/composables/events/ReloadUserGroupsEvent');
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
    GroupService.findByUserId.mockImplementation(() => Promise.resolve(['group']));

    ReloadUserGroupsEvent.subscribe.mockImplementation(() => {
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
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.loadGroups();

      expect(wrapper.vm.groups).toEqual(['group']);
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
    it('should subscribe ReloadUserGroupsEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadUserGroupsEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
