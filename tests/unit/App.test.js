import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import App from 'src/App.vue';

installQuasarPlugin();

describe('Test component: App', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
