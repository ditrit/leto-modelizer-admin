import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesTable from 'src/components/tables/RolesTable.vue';

installQuasarPlugin();

describe('Test component: RolesTable', async () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RolesTable, {
      props: {
        roles: [
          { name: 'lib_' },
          { name: 'CF_' },
          { name: 'admin' },
          { name: '' },
        ],
      },
    });
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
