import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsPage from 'pages/UserGroupsPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import DialogEvent from 'src/composables/DialogEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/DialogEvent');

describe('Test component: UserGroupsPage', () => {
  let wrapper;
  let push;

  beforeEach(() => {
    push = vi.fn();
    useRouter.mockImplementation(() => ({ push }));

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
});
