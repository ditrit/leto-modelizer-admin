import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsPage from 'pages/UserGroupsPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as UserGroupService from 'src/services/UserGroupService';
import ReloadUserGroupsEvent from 'src/composables/events/ReloadUserGroupsEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/events/DialogEvent');
vi.mock('src/services/UserGroupService');
vi.mock('src/composables/events/ReloadUserGroupsEvent');

describe('Test component: UserGroupsPage', () => {
  let wrapper;
  let push;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    push = vi.fn();
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    useRouter.mockImplementation(() => ({ push }));

    UserGroupService.find.mockImplementation(() => Promise.resolve(['group']));

    ReloadUserGroupsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(UserGroupsPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToUserGroup', () => {
    it('should redirect to userGroup page', () => {
      wrapper.vm.goToUserGroup('1');

      expect(push).toBeCalledWith('/user-groups/1');
    });
  });

  describe('Test function: openRemoveUserGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveUserGroupDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-userGroup',
        type: 'open',
        userGroup: 'test',
      });
    });
  });

  describe('Test function: search', () => {
    it('should set userGroups', async () => {
      wrapper.vm.userGroups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.userGroups).toEqual(['group']);
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DialogEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
