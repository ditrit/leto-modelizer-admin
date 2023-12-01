import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
  vi,
} from 'vitest';
import ApplicationFooter from 'src/components/footer/ApplicationFooter.vue';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin();

vi.stubGlobal('$sanitize', true);

describe('Test component: ApplicationFooter', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    wrapper = mount(ApplicationFooter);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
