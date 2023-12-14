import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesTable from 'src/components/tables/RolesTable.vue';
import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('src/services/RoleService');

describe('Test component: RolesTable', async () => {
  let wrapper;

  beforeEach(() => {
    RoleService.find.mockImplementation(() => Promise.resolve([
      { name: 'lib_' },
      { name: 'CF_' },
      { name: 'admin' },
      { name: '' },
    ]));

    wrapper = shallowMount(RolesTable);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: getRolesWithType', () => {
    it('should return an array with corresponding type', async () => {
      const roles = await wrapper.vm.getRolesWithType();

      expect(roles).toEqual([
        {
          color: 'blue',
          name: 'lib_',
          type: 'Library',
        },
        {
          color: 'orange',
          name: 'CF_',
          type: 'System',
        },
        {
          color: 'orange',
          name: 'admin',
          type: 'System',
        },
        {
          color: 'teal',
          name: '',
          type: 'Functional',
        },
      ]);
    });
  });
});
