import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveUserDialog from 'src/components/dialog/RemoveUserDialog.vue';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    Notify.create = vi.fn();
    wrapper = mount(RemoveUserDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should remove user', async () => {
      wrapper.vm.user = { objectId: 'test' };
      UserService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(UserService.remove).toBeCalledWith('test');
    });
  });
});
