import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('src/composables/LetoModelizerApi');

describe('Test component: LibrariesTable', async () => {
  let wrapper;
  const api = await import('src/composables/LetoModelizerApi');

  api.getLibraries.mockImplementation(() => Promise.resolve({ data: { results: [] } }));

  beforeEach(() => {
    wrapper = shallowMount(LibrariesTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
