import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesPage from 'pages/RolesPage.vue';
import { vi } from 'vitest';
import * as RoleService from 'src/services/RoleService';

installQuasarPlugin();

vi.mock('src/services/RoleService');

describe('Test component: RolesPage', () => {
  let wrapper;

  beforeEach(() => {
    RoleService.find.mockImplementation(() => Promise.resolve());

    wrapper = shallowMount(RolesPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
