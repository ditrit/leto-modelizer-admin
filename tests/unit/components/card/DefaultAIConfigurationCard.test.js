import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import { vi } from 'vitest';
import DefaultAIConfigurationCard from 'src/components/card/DefaultAIConfigurationCard.vue';
import * as ConfigurationService from 'src/services/ConfigurationService';
import ReloadConfigurationsEvent from 'src/composables/events/ReloadConfigurationsEvent';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/ConfigurationService');
vi.mock('src/composables/events/ReloadConfigurationsEvent');

describe('Test component: DefaultAIConfigurationCard', () => {
  let wrapper;

  beforeEach(() => {
    ConfigurationService.find.mockImplementation(() => Promise.resolve({ content: [{ name: 'Library_1', id: 1 }] }));

    wrapper = shallowMount(DefaultAIConfigurationCard, {
      props: {
        handlers: ['handler1', 'handler2'],
        configurations: [{
          id: 'id_1',
          handler: null,
          key: 'plugin.preferences.plugin1',
          value: 'handler1',
        }, {
          id: 'id_2',
          handler: null,
          key: 'plugin.preferences.plugin2',
          value: 'handler2',
        }, {
          id: 'id_1',
          handler: 'handler1',
          key: 'test',
          value: 'value',
        }],
      },
    });
  });

  describe('Test function: initPlugins', () => {
    it('should set plugins and configurations', () => {
      wrapper.vm.pluginPreferences = {};
      wrapper.vm.plugins = [];

      wrapper.vm.initPlugins();

      expect(wrapper.vm.plugins).toEqual(['plugin1', 'plugin2']);
      expect(wrapper.vm.pluginPreferences).toEqual({
        plugin1: {
          id: 'id_1',
          key: 'plugin.preferences.plugin1',
          value: 'handler1',
        },
        plugin2: {
          id: 'id_2',
          key: 'plugin.preferences.plugin2',
          value: 'handler2',
        },
      });
    });
  });

  describe('Test function: deleteConfiguration', () => {
    it('should delete configuration', async () => {
      const event = vi.fn();

      Notify.create = vi.fn();
      ReloadConfigurationsEvent.next.mockImplementation(event);
      ConfigurationService.deleteById.mockImplementation(() => Promise.resolve());
      wrapper.vm.submitting = true;

      await wrapper.vm.deleteConfiguration('id_1');

      expect(wrapper.vm.submitting).toEqual(false);
      expect(ReloadConfigurationsEvent.next).toBeCalled();
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Configuration is deleted.',
        html: true,
      });
    });
  });

  describe('Test function: onSubmitNewPlugin', () => {
    it('should create configuration', async () => {
      const event = vi.fn();

      Notify.create = vi.fn();
      ReloadConfigurationsEvent.next.mockImplementation(event);
      ConfigurationService.add.mockImplementation(() => Promise.resolve());
      wrapper.vm.submitting = true;
      wrapper.vm.newPluginName = 'plugin3';
      wrapper.vm.newPluginHandler = 'value';

      await wrapper.vm.onSubmitNewPlugin();

      expect(ConfigurationService.add).toBeCalledWith({
        handler: null,
        key: 'plugin.preferences.plugin3',
        value: 'value',
      });
      expect(wrapper.vm.submitting).toEqual(false);
      expect(ReloadConfigurationsEvent.next).toBeCalled();
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Configuration is added.',
        html: true,
      });
    });
  });

  describe('Test function: onSubmitUpdate', () => {
    it('should create configuration', async () => {
      const event = vi.fn();

      Notify.create = vi.fn();
      ReloadConfigurationsEvent.next.mockImplementation(event);
      ConfigurationService.updateAll.mockImplementation(() => Promise.resolve());
      wrapper.vm.submitting = true;

      await wrapper.vm.onSubmitUpdate();

      expect(ConfigurationService.updateAll).toBeCalledWith([{
        id: 'id_1',
        key: 'plugin.preferences.plugin1',
        value: 'handler1',
      }, {
        id: 'id_2',
        key: 'plugin.preferences.plugin2',
        value: 'handler2',
      }]);
      expect(wrapper.vm.submitting).toEqual(false);
      expect(ReloadConfigurationsEvent.next).toBeCalled();
      expect(Notify.create).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Configuration(s) is updated.',
        html: true,
      });
    });
  });
});
