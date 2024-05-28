import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachRoleToUserDialog from 'src/components/dialog/AttachRoleToUserDialog.vue';
import * as RoleService from 'src/services/RoleService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachRoleToUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    RoleService.find.mockImplementation(() => Promise.resolve({ content: ['roles'] }));

    wrapper = mount(AttachRoleToUserDialog);
  });

  describe('Test function: search', () => {
    it('should set roles', async () => {
      wrapper.vm.roles = [];

      await wrapper.vm.search();

      expect(wrapper.vm.roles).toEqual(['roles']);
    });
  });
});
