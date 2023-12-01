import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import UsersPage from 'pages/UsersPage.vue';

installQuasarPlugin();

describe('Test component: UsersPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(UsersPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
