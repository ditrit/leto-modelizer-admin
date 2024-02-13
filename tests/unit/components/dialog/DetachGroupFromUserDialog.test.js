import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachGroupFromUserDialog from 'src/components/dialog/DetachGroupFromUserDialog.vue';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: DetachGroupFromUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(DetachGroupFromUserDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after detaching group from user', async () => {
      Notify.create = vi.fn();
      wrapper.vm.user = {
        id: 'id',
      };
      wrapper.vm.group = {
        id: 'id',
      };
      GroupService.dissociateGroupAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });
  });
});
