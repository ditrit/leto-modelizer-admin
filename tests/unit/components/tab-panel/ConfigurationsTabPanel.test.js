import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import ConfigurationsTabPanel from 'src/components/tab-panel/ConfigurationsTabPanel.vue';
import * as ConfigurationService from 'src/services/ConfigurationService';
import { vi } from 'vitest';
import { Notify } from 'quasar';
import { useRoute } from 'vue-router';
import ReloadConfigurationsEvent from 'src/composables/events/ReloadConfigurationsEvent';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');
vi.mock('src/services/ConfigurationService');
vi.mock('src/composables/events/ReloadConfigurationsEvent');

describe('Test component: ConfigurationsTabPanel', async () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(async () => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    ConfigurationService.findAll
      .mockImplementation(() => Promise.resolve([]));
    ConfigurationService.findDescriptionFields
      .mockImplementation(() => Promise.resolve({}));

    ReloadConfigurationsEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    useRoute.mockImplementation(() => ({
      query: {},
    }));

    wrapper = shallowMount(ConfigurationsTabPanel);
  });

  describe('Test function: loadConfigurationDescriptions', () => {
    it('should set handlers and configurations', async () => {
      ConfigurationService.findDescriptionFields
        .mockImplementation(() => Promise.resolve({
          handler1: ['test1'],
          handler2: ['test2'],
        }));

      wrapper.vm.descriptions = {};
      wrapper.vm.handlers = [];

      await wrapper.vm.loadConfigurationDescriptions();

      expect(wrapper.vm.descriptions).toEqual({
        handler1: ['test1'],
        handler2: ['test2'],
      });
      expect(wrapper.vm.handlers).toEqual(['handler1', 'handler2']);
    });
  });

  describe('Test function: loadConfigurations', () => {
    it('should set configurations and plugins', async () => {
      wrapper.vm.handlers = ['handler1', 'handler2'];

      ConfigurationService.findAll
        .mockImplementation(() => Promise.resolve([{
          handler: '',
          key: 'plugin.preferences.plugin1',
        }, {
          handler: '',
          key: 'plugin.preferences.plugin2',
        }, {
          handler: 'handler1',
          key: 'conf1',
        }, {
          handler: 'handler2',
          key: 'conf1',
        }, {
          handler: 'handler3',
          key: 'conf2',
        }]));

      await wrapper.vm.loadConfigurations();

      expect(wrapper.vm.plugins).toEqual(['plugin1', 'plugin2']);
      expect(wrapper.vm.configurations).toEqual({
        default: [{
          handler: '',
          key: 'plugin.preferences.plugin1',
        }, {
          handler: '',
          key: 'plugin.preferences.plugin2',
        }],
        handler1: [{
          handler: 'handler1',
          key: 'conf1',
        }],
        handler2: [{
          handler: 'handler2',
          key: 'conf1',
        }],
        handler3: [{
          handler: 'handler3',
          key: 'conf2',
        }],
      });
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe ReloadConfigurationsEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe ReloadConfigurationsEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
