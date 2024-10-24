import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveSecretDialog from 'src/components/dialog/RemoveSecretDialog.vue';
import * as SecretService from 'src/services/SecretService';
import ReloadSecretsEvent from 'src/composables/events/ReloadSecretsEvent';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/SecretService');
vi.mock('src/composables/events/ReloadSecretsEvent');

describe('Test component: RemoveSecretDialog', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(RemoveSecretDialog);
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.secret = { id: 'id_1' };
      wrapper.vm.show = true;
      wrapper.vm.submitting = false;

      SecretService.remove.mockImplementation(() => Promise.resolve());
    });

    it('should handle successful submission', async () => {
      Notify.create = vi.fn();

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Secret is deleted.',
        html: true,
      });
      expect(wrapper.vm.show).toBe(false);
      expect(wrapper.vm.submitting).toBe(false);
      expect(ReloadSecretsEvent.next).toHaveBeenCalled();
    });

    it('should handle failed submission', async () => {
      Notify.create = vi.fn();

      SecretService.remove.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith({
        type: 'negative',
        message: 'Error during secret deletion.',
        html: true,
      });
      expect(wrapper.vm.show).toBe(false);
      expect(wrapper.vm.submitting).toBe(false);
      expect(ReloadSecretsEvent.next).toHaveBeenCalled();
    });
  });
});
