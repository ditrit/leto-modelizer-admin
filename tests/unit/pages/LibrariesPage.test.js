import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibrariesPage from 'pages/LibrariesPage.vue';

installQuasarPlugin();

describe('Test component: LibrariesPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(LibrariesPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
