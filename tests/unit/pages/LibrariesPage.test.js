import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibrariesPage from 'pages/LibrariesPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('vue-router');

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
});
