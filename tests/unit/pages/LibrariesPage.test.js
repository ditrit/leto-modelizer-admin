import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibrariesPage from 'pages/LibrariesPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import DialogEvent from 'src/composables/DialogEvent';

installQuasarPlugin();

vi.mock('vue-router');
vi.mock('src/composables/DialogEvent');

describe('Test component: LibrariesPage', () => {
  let wrapper;
  let push;

  beforeEach(() => {
    push = vi.fn();
    useRouter.mockImplementation(() => ({ push }));

    wrapper = shallowMount(LibrariesPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: goToLibrary', () => {
    it('should redirect to library page', () => {
      wrapper.vm.goToLibrary('1');

      expect(push).toBeCalledWith('/libraries/1');
    });
  });

  describe('Test function: openRemoveLibraryDialog', () => {
    it('should open dialog', () => {
      DialogEvent.next.mockImplementation();
      wrapper.vm.openRemoveLibraryDialog('test');

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-library',
        type: 'open',
        library: 'test',
      });
    });
  });
});
