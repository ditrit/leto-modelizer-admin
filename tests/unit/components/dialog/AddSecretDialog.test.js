import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AddSecretDialog from 'src/components/dialog/AddSecretDialog.vue';
import * as SecretService from 'src/services/SecretService';
import ReloadSecretsEvent from 'src/composables/events/ReloadSecretsEvent';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/SecretService');
vi.mock('src/composables/events/ReloadSecretsEvent');

describe('Test component: AddSecretDialog', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AddSecretDialog);
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.secretKey = 'key';
      wrapper.vm.secretValue = 'value';
      wrapper.vm.show = true;
      wrapper.vm.submitting = false;

      SecretService.add.mockImplementation(() => Promise.resolve({
        id: 'id_1',
        key: 'key',
      }));
    });

    it('should handle successful submission', async () => {
      Notify.create = vi.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Secret is added.',
        html: true,
      });
      expect(wrapper.vm.show).toBe(false);
      expect(wrapper.vm.submitting).toBe(false);
      expect(ReloadSecretsEvent.next).toHaveBeenCalled();
    });

    it('should handle failed submission', async () => {
      Notify.create = vi.fn();

      SecretService.add.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Error during secret creation.',
        html: true,
      });
      expect(wrapper.vm.submitting).toBe(false);
    });
  });
});
