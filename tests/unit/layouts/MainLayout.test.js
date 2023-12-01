import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import MainLayout from 'src/layouts/MainLayout.vue';

installQuasarPlugin();

describe('Test component: MainLayout', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(MainLayout);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
