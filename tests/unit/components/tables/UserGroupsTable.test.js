import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('src/services/UserGroupService');

describe('Test component: UserGroupsTable', async () => {
  let wrapper;
  const UserGroupService = await import('src/services/UserGroupService');

  UserGroupService.find.mockImplementation(() => Promise.resolve([]));

  beforeEach(() => {
    wrapper = shallowMount(UserGroupsTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
