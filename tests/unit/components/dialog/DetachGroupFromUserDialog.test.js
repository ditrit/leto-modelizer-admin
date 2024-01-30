import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachGroupFromUserDialog from 'src/components/dialog/DetachGroupFromUserDialog.vue';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
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
        objectId: 'id',
      };
      wrapper.vm.group = {
        objectId: 'id',
      };
      UserService.removeUserFromGroup.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });
  });
});
