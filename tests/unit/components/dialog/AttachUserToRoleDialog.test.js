import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachUserToRoleDialog from 'src/components/dialog/AttachUserToRoleDialog.vue';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachUserToRoleDialog', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    UserService.find.mockImplementation(() => Promise.resolve({ content: ['users'] }));

    wrapper = mount(AttachUserToRoleDialog);
  });

  describe('Test function: search', () => {
    it('should set users', async () => {
      wrapper.vm.users = [];

      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(['users']);
    });
  });
});
