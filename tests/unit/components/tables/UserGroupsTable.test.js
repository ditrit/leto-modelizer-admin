import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('src/composables/LetoModelizerApi');

describe('Test component: UserGroupsTable', async () => {
  let wrapper;
  const api = await import('src/composables/LetoModelizerApi');

  api.getUserGroups.mockImplementation(() => Promise.resolve({ data: { results: [] } }));

  beforeEach(() => {
    wrapper = shallowMount(UserGroupsTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
