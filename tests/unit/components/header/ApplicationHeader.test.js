import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import ApplicationHeader from 'src/components/header/ApplicationHeader.vue';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin();

describe('Test component: ApplicationHeader', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    wrapper = mount(ApplicationHeader, {});
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
