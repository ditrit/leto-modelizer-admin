import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveUserGroupDialog from 'src/components/dialog/RemoveUserGroupDialog.vue';
import * as UserGroupService from 'src/services/UserGroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserGroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveUserGroupDialog', () => {
  let wrapper;

  beforeEach(() => {
    Notify.create = vi.fn();
    wrapper = mount(RemoveUserGroupDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should remove userGroup', async () => {
      wrapper.vm.userGroup = { objectId: 'test' };
      UserGroupService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(UserGroupService.remove).toBeCalledWith('test');
    });
  });
});
