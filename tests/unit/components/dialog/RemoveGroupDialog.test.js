import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveGroupDialog from 'src/components/dialog/RemoveGroupDialog.vue';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveGroupDialog', () => {
  let wrapper;

  beforeEach(() => {
    Notify.create = vi.fn();
    wrapper = mount(RemoveGroupDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should remove group', async () => {
      wrapper.vm.group = { objectId: 'test' };
      GroupService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(GroupService.remove).toBeCalledWith('test');
    });
  });
});
