import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveLibraryDialog from 'src/components/dialog/RemoveLibraryDialog.vue';
import * as LibraryService from 'src/services/LibraryService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/LibraryService');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveLibraryDialog', () => {
  let wrapper;

  beforeEach(() => {
    Notify.create = vi.fn();
    wrapper = mount(RemoveLibraryDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should remove library', async () => {
      wrapper.vm.library = { objectId: 'test' };
      LibraryService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(LibraryService.remove).toBeCalledWith('test');
    });
  });
});
