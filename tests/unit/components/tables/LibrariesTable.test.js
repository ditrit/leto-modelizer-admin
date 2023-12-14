import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
import * as LibraryService from 'src/services/LibraryService';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('src/services/LibraryService');

describe('Test component: LibrariesTable', async () => {
  let wrapper;

  beforeEach(() => {
    LibraryService.find.mockImplementation(() => Promise.resolve({ data: { results: [] } }));

    wrapper = shallowMount(LibrariesTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
