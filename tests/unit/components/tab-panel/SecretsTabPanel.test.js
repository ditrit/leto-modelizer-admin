import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import SecretsTabPanel from 'src/components/tab-panel/SecretsTabPanel.vue';
import * as SecretService from 'src/services/SecretService';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import { useRoute } from 'vue-router';
import ReloadSecretsEvent from 'src/composables/events/ReloadSecretsEvent';
import DialogEvent from 'src/composables/events/DialogEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/SecretService');
vi.mock('src/composables/events/ReloadSecretsEvent');
vi.mock('src/composables/events/DialogEvent');

describe('Test component: SecretsTabPanel', async () => {
  let wrapper;
  let data;
  let subscribe;
  let unsubscribe;

  beforeEach(async () => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    ReloadSecretsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    data = {
      content: [],
      pageable: {
        pageNumber: 0,
      },
      totalPages: 0,
      size: 10,
      totalElements: 0,
    };

    SecretService.find.mockImplementation(() => Promise.resolve(data));

    useRoute.mockImplementation(() => ({
      query: {},
    }));

    wrapper = shallowMount(SecretsTabPanel);
  });

  describe('Test function: openAddSecretDialog', () => {
    it('should call add a secret dialog', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openAddSecretDialog();

      expect(DialogEvent.next).toBeCalledWith({
        key: 'add-secret',
        type: 'open',
      });
    });
  });

  describe('Test function: openUpdateSecretDialog', () => {
    it('should call update a secret', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openUpdateSecretDialog({ id: 'id_1' });

      expect(DialogEvent.next).toBeCalledWith({
        key: 'update-secret',
        type: 'open',
        secret: { id: 'id_1' },
      });
    });
  });

  describe('Test function: openRemoveSecretDialog', () => {
    it('should call remove a secret', async () => {
      DialogEvent.next.mockImplementation();

      wrapper.vm.openRemoveSecretDialog({ id: 'id_1' });

      expect(DialogEvent.next).toBeCalledWith({
        key: 'remove-secret',
        type: 'open',
        secret: { id: 'id_1' },
      });
    });
  });

  describe('Test function: search', () => {
    it('should load secrets', async () => {
      wrapper.vm.loading = true;
      wrapper.vm.secrets = ['test'];

      await wrapper.vm.search();

      expect(wrapper.vm.loading).toEqual(false);
      expect(wrapper.vm.secrets).toEqual(([]));
      expect(wrapper.emitted()).toEqual({
        'update:secrets-query': [[{}], [{}]],
      });
    });
  });

  describe('Test hook function: ReloadSecretsEvent', () => {
    it('should subscribe ReloadSecretsEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadSecretsEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
