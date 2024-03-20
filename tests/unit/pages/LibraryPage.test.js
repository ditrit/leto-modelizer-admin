import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibraryPage from 'pages/LibraryPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as LibraryService from 'src/services/LibraryService';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/LibraryService');
vi.mock('vue-router');

describe('Test component: LibraryPage', () => {
  let wrapper;
  let push;
  const library = {
    id: 1,
    url: 'test/',
  };
  const templates = {
    content: [{
      id: 2,
      plugins: ['test1', 'test2'],
    }],
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    LibraryService.findById.mockImplementation(() => Promise.resolve(library));
    LibraryService.findTemplates.mockImplementation(() => Promise.resolve(templates));

    wrapper = shallowMount(LibraryPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadLibrary', () => {
    it('should set data on valid library', async () => {
      wrapper.vm.library = {};

      await wrapper.vm.loadLibrary();

      expect(wrapper.vm.library).toEqual({
        ...library,
        synchronizeUrl: 'test/index.json',
      });
    });

    it('should redirect on unknown library', async () => {
      LibraryService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadLibrary();

      expect(push).toBeCalledWith('/libraries');
    });
  });

  describe('Test function: loadTemplates', () => {
    it('should set data on valid library', async () => {
      wrapper.vm.library = { id: 1 };
      wrapper.vm.templates = {};

      await wrapper.vm.loadTemplates();

      expect(wrapper.vm.templates).toEqual([{
        ...templates.content[0],
        plugins: 'test1, test2',
      }]);
    });
  });
});
