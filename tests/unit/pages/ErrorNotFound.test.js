import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import ErrorNotFoundPage from 'src/pages/ErrorNotFound.vue';

installQuasarPlugin();

describe('Test component: ErrorNotFound', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ErrorNotFoundPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
