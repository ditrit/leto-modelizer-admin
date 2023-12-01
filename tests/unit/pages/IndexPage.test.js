import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import IndexPage from 'src/pages/IndexPage.vue';

installQuasarPlugin();

describe('Test component: IndexPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(IndexPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
