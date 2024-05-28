import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachGroupToUserDialog from 'src/components/dialog/AttachGroupToUserDialog.vue';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachGroupToUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    GroupService.find.mockImplementation(() => Promise.resolve({ content: ['group'] }));

    wrapper = mount(AttachGroupToUserDialog);
  });

  describe('Test function: search', () => {
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(['group']);
    });
  });
});
