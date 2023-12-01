import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import ApplicationDrawer from 'src/components/drawer/ApplicationDrawer.vue';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin();

describe('Test component: ApplicationDrawer', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());
    // Use shallow mount to mock by default $route/$router in template.
    wrapper = shallowMount(ApplicationDrawer);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
