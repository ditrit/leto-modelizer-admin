import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachUserToGroupDialog from 'src/components/dialog/AttachUserToGroupDialog.vue';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachUserToGroupDialog', () => {
  let wrapper;
  let data;

  beforeEach(() => {
    setActivePinia(createPinia());

    data = {
      content: ['users'],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    UserService.find.mockImplementation(() => Promise.resolve(data));

    wrapper = mount(AttachUserToGroupDialog);
  });

  describe('Test function: search', () => {
    it('should set users', async () => {
      wrapper.vm.users = [];

      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(['users']);
    });
  });
});
