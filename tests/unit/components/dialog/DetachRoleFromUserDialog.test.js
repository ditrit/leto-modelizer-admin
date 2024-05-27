import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachRoleFromUserDialog from 'src/components/dialog/DetachRoleFromUserDialog.vue';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.mock('src/composables/events/DialogEvent');

vi.stubGlobal('$sanitize', true);

describe('Test component: DetachRoleFromUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    setActivePinia(createPinia());

    wrapper = mount(DetachRoleFromUserDialog);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
