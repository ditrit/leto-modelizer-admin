import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsTable from 'src/components/tables/UserGroupsTable.vue';
import { vi } from 'vitest';
import * as UserGroupService from 'src/services/UserGroupService';

installQuasarPlugin();

vi.mock('src/services/UserGroupService');

describe('Test component: UserGroupsTable', () => {
  let wrapper;

  UserGroupService.find.mockImplementation(() => Promise.resolve([]));

  beforeEach(() => {
    wrapper = shallowMount(UserGroupsTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
