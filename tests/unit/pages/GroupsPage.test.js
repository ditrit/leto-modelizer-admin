import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupsPage from 'pages/GroupsPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import DialogEvent from 'src/composables/events/DialogEvent';
import * as GroupService from 'src/services/GroupService';
import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/events/DialogEvent');
vi.mock('src/services/GroupService');
vi.mock('src/composables/events/ReloadGroupsEvent');

describe('Test component: GroupsPage', () => {
  let wrapper;
  let push;
  let subscribe;
  let unsubscribe;

  beforeEach(() => {
    push = vi.fn();
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    useRouter.mockImplementation(() => ({ push }));

    GroupService.find.mockImplementation(() => Promise.resolve(['group']));

    ReloadGroupsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(GroupsPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToGroup', () => {
    it('should redirect to group page', () => {
      wrapper.vm.goToGroup('1');

      expect(push).toBeCalledWith('/groups/1');
    });
  });

  describe('Test function: openRemoveGroupDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveGroupDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-group',
        type: 'open',
        group: 'test',
      });
    });
  });

  describe('Test function: search', () => {
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(['group']);
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
