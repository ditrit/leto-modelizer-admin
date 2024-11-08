import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import { vi } from 'vitest';
import CustomAIConfigurationCard from 'src/components/card/CustomAIConfigurationCard.vue';
import * as ConfigurationService from 'src/services/ConfigurationService';
import ReloadConfigurationsEvent from 'src/composables/events/ReloadConfigurationsEvent';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/ConfigurationService');
vi.mock('src/composables/events/ReloadConfigurationsEvent');

describe('Test component: CustomAIConfigurationCard', () => {
  let wrapper;

  beforeEach(() => {
    ConfigurationService.find.mockImplementation(() => Promise.resolve({ content: [{ name: 'Library_1', id: 1 }] }));

    wrapper = shallowMount(CustomAIConfigurationCard, {
      props: {
        handlers: ['handler1', 'handler2'],
        plugins: ['plugin1', 'plugin2'],
        descriptions: [{
          pluginDependent: true,
          key: 'key1.{{ plugin }}',
          defaultValue: 'defaultValueKey1',
        }, {
          pluginDependent: false,
          key: 'key2',
          defaultValue: 'defaultValueKey2',
        }, {
          pluginDependent: false,
          key: 'key3',
          defaultValue: 'defaultValueKey3',
        }],
        configurations: [{
          id: 'id_1',
          handler: 'handler1',
          key: 'key1.plugin1',
          value: 'value1',
        }, {
          id: 'id_2',
          handler: 'handler1',
          key: 'key2',
          value: 'value2',
        }],
      },
    });
  });

  describe('Test function: initFields', () => {
    it('should set fields', () => {
      wrapper.vm.defaultFields = [];
      wrapper.vm.pluginFields = {};

      wrapper.vm.initFields();

      expect(wrapper.vm.defaultFields).toEqual([{
        id: 'id_2',
        key: 'key2',
        value: 'value2',
        pluginDependent: false,
        defaultValue: 'defaultValueKey2',
      }, {
        id: null,
        key: 'key3',
        value: 'defaultValueKey3',
        pluginDependent: false,
        defaultValue: 'defaultValueKey3',
      }]);
      expect(wrapper.vm.pluginFields).toEqual({
        plugin1: [{
          id: 'id_1',
          key: 'key1.plugin1',
          value: 'value1',
          pluginDependent: true,
          defaultValue: 'defaultValueKey1',
        }],
        plugin2: [{
          id: null,
          key: 'key1.plugin2',
          value: 'defaultValueKey1',
          pluginDependent: true,
          defaultValue: 'defaultValueKey1',
        }],
      });
    });
  });

  describe('Test function: onSubmit', () => {
    it('should create, update and delete configurations', async () => {
      Notify.create = vi.fn();

      ConfigurationService.updateAll.mockImplementation(() => Promise.resolve());
      ConfigurationService.add.mockImplementation(() => Promise.resolve());
      ConfigurationService.deleteById.mockImplementation(() => Promise.resolve());
      wrapper.vm.submitting = true;
      wrapper.vm.defaultFields = [{
        id: 'id_1', // To update
        key: 'key1',
        value: 'value1',
        handler: 'handler1',
      }, {
        id: 'id_2', // To delete
        key: 'key2',
        value: '',
        handler: 'handler1',
      }, {
        id: null, // To create
        key: 'key3',
        value: 'value3',
        handler: 'handler1',
      }];
      wrapper.vm.pluginFields = {
        plugin1: [{
          id: 'id_4', // To update
          key: 'key4',
          value: 'value4',
          handler: 'handler1',
        }, {
          id: 'id_5', // To delete
          key: 'key5',
          value: '',
          handler: 'handler1',
        }, {
          id: null, // To create
          key: 'key6',
          value: 'value6',
          handler: 'handler1',
        }],
        plugin2: [{
          id: 'id_7', // To update
          key: 'key7',
          value: 'value7',
          handler: 'handler1',
        }, {
          id: 'id_8', // To delete
          key: 'key8',
          value: '',
          handler: 'handler1',
        }, {
          id: null, // To create
          key: 'key9',
          value: 'value9',
          handler: 'handler1',
        }],
      };

      await wrapper.vm.onSubmit();
      expect(ConfigurationService.updateAll).toBeCalledWith([{
        id: 'id_1',
        key: 'key1',
        value: 'value1',
        handler: 'handler1',
      }, {
        id: 'id_4',
        key: 'key4',
        value: 'value4',
        handler: 'handler1',
      }, {
        id: 'id_7',
        key: 'key7',
        value: 'value7',
        handler: 'handler1',
      }]);
      expect(ConfigurationService.add).toBeCalledTimes(3);
      expect(ConfigurationService.add).toHaveBeenCalledWith({
        key: 'key3',
        value: 'value3',
        handler: 'handler1',
      });
      expect(ConfigurationService.add).toHaveBeenCalledWith({
        key: 'key6',
        value: 'value6',
        handler: 'handler1',
      });
      expect(ConfigurationService.add).toHaveBeenCalledWith({
        key: 'key9',
        value: 'value9',
        handler: 'handler1',
      });
      expect(ConfigurationService.deleteById).toBeCalledTimes(3);
      expect(ConfigurationService.deleteById).toHaveBeenCalledWith('id_2');
      expect(ConfigurationService.deleteById).toHaveBeenCalledWith('id_5');
      expect(ConfigurationService.deleteById).toHaveBeenCalledWith('id_8');
      expect(wrapper.vm.submitting).toEqual(false);
      expect(ReloadConfigurationsEvent.next).toBeCalled();
      expect(Notify.create).toBeCalledWith({
        type: 'positive',
        message: 'Configuration is saved.',
        html: true,
      });
    });
  });
});
