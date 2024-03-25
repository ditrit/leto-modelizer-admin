import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachGroupFromGroupDialog from 'src/components/dialog/DetachGroupFromGroupDialog.vue';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: DetachGroupFromGroupDialog', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(DetachGroupFromGroupDialog);

    wrapper.vm.group = {
      id: 'groupId',
    };
    wrapper.vm.grouptoDetach = {
      id: 'groupIdtoDetach',
    };
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after detaching group from group', async () => {
      Notify.create = vi.fn();

      GroupService.dissociateGroupAndGroup.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });
  });
});
