import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersTable from 'src/components/tables/UsersTable.vue';
import { vi } from 'vitest';
import * as UserService from 'src/services/UserService';

installQuasarPlugin();

vi.mock('src/services/UserService');

describe('Test component: UsersTable', () => {
  let wrapper;

  UserService.find.mockImplementation(() => Promise.resolve([]));

  beforeEach(() => {
    wrapper = shallowMount(UsersTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
