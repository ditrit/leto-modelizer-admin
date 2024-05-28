import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachPermissionToRoleDialog from 'src/components/dialog/AttachPermissionToRoleDialog.vue';
import * as PermissionService from 'src/services/PermissionService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/PermissionService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachPermissionToRoleDialog', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    PermissionService.find.mockImplementation(() => Promise.resolve({ content: ['permissions'] }));

    wrapper = mount(AttachPermissionToRoleDialog);
  });

  describe('Test function: search', () => {
    it('should set permissions', async () => {
      wrapper.vm.permissions = [];

      await wrapper.vm.search();

      expect(wrapper.vm.permissions).toEqual(['permissions']);
    });
  });
});
