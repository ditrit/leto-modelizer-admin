import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import { vi } from 'vitest';
import * as UserGroupService from 'src/services/UserGroupService';
import ReloadUserGroupsEvent from 'src/composables/events/ReloadUserGroupsEvent';

installQuasarPlugin();

vi.mock('src/services/UserGroupService');
vi.mock('src/composables/events/ReloadUserGroupsEvent');

describe('Test component: UserGroupsTable', () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(async () => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    UserGroupService.find.mockImplementation(() => Promise.resolve([]));

    ReloadUserGroupsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(UserGroupsTable);
    await wrapper.vm.$nextTick();
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
