import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesTable from 'src/components/tables/RolesTable.vue';
import { vi } from 'vitest';

installQuasarPlugin();

vi.mock('src/composables/LetoModelizerApi');

describe('Test component: RolesTable', async () => {
  let wrapper;
  const api = await import('src/composables/LetoModelizerApi');

  api.getRoles.mockImplementation(() => Promise.resolve({
    data: {
      results: [
        { name: 'lib_' },
        { name: 'CF_' },
        { name: 'admin' },
        { name: '' },
      ],
    },
  }));

  beforeEach(() => {
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
