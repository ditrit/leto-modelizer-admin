import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UserGroupsPage from 'pages/UserGroupsPage.vue';

installQuasarPlugin();

describe('Test component: UserGroupsPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(UserGroupsPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
