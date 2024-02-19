import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RedirectDialog from 'src/components/dialog/RedirectDialog.vue';

installQuasarPlugin();

vi.mock('src/services/RoleService');
vi.mock('src/services/UserService');
vi.mock('src/composables/events/DialogEvent');

vi.stubGlobal('$sanitize', true);

describe('Test component: RedirectDialog', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(RedirectDialog);
  });

  describe('Test function: onSubmit', () => {
    it('Should change location', () => {
      process.env.LETO_MODELIZER_URL = 'http://localhost:8080/';
      wrapper.vm.onSubmit();
      expect(window.location.href).toEqual(process.env.LETO_MODELIZER_URL);
    });
  });
});
