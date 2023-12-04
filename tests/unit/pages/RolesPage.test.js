import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesPage from 'pages/RolesPage.vue';

installQuasarPlugin();

describe('Test component: RolesPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RolesPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
