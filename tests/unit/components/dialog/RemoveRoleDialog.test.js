import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveRoleDialog from 'src/components/dialog/RemoveRoleDialog.vue';
import * as RoleService from 'src/services/RoleService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveRoleDialog', () => {
  let wrapper;

  beforeEach(() => {
    Notify.create = vi.fn();
    wrapper = mount(RemoveRoleDialog);

    wrapper.vm.role = { id: 'test' };
  });

  describe('Test function: onSubmit', () => {
    it('should remove role and send positive notification', async () => {
      Notify.create = vi.fn();

      RoleService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(RoleService.remove).toBeCalledWith('test');
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification when removal fails', async () => {
      Notify.create = vi.fn();

      RoleService.remove.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(RoleService.remove).toBeCalledWith('test');
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
