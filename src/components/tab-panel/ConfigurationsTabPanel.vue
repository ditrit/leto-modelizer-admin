<template>
  <q-tab-panel
    name="configurations"
    data-cy="configurations_tab_panel"
  >
    <q-linear-progress
      v-if="loading"
      color="primary"
    />

    <h6
      class="q-ma-none q-mb-sm"
      data-cy="configurations_title"
    >
      {{ $t('ConfigurationsTabPanel.text.title') }}
    </h6>
    <div class="row justify-center">
      <default-ai-configuration-card
        :handlers="handlers"
        :configurations="configurations.default"
      />
    </div>
    <div class="row justify-center q-mt-md">
      <custom-ai-configuration-card
        v-for="handler in handlers"
        :key="handler"
        :handler="handler"
        :configurations="configurations[handler]"
        :plugins="plugins"
        :descriptions="descriptions[handler]"
        class="q-ma-md"
      />
    </div>
  </q-tab-panel>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import DefaultAiConfigurationCard from 'src/components/card/DefaultAIConfigurationCard.vue';
import CustomAiConfigurationCard from 'src/components/card/CustomAIConfigurationCard.vue';
import * as ConfigurationService from 'src/services/ConfigurationService';
import ReloadConfigurationsEvent from 'src/composables/events/ReloadConfigurationsEvent';

const loading = ref(true);
const configurations = ref({
  default: [],
});
const descriptions = ref({});
const handlers = ref([]);
const plugins = ref([]);

let reloadConfigurationsEventSubscription;

/**
 * Load all descriptions for configurations form.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadConfigurationDescriptions() {
  const newHandlers = [];

  return ConfigurationService
    .findDescriptionFields()
    .then((data) => {
      Object.keys(data).forEach((key) => {
        newHandlers.push(key);
        configurations.value[key] = [];
      });
      descriptions.value = data;
    }).finally(() => {
      handlers.value = newHandlers;
    });
}

/**
 * Load all configurations.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadConfigurations() {
  const keyPart = 'plugin.preferences.';
  const newConfigurations = { default: [] };
  const newPlugins = [];

  return ConfigurationService
    .findAll()
    .then((data) => {
      data.forEach((item) => {
        if (!item.handler) {
          newConfigurations.default.push(item);

          if (item.key.indexOf(keyPart) === 0) {
            newPlugins.push(item.key.substring(keyPart.length));
          }

          return;
        }

        if (!Object.prototype.hasOwnProperty.call(newConfigurations, item.handler)) {
          newConfigurations[item.handler] = [];
        }

        newConfigurations[item.handler].push(item);
      });
    }).finally(() => {
      configurations.value = newConfigurations;
      plugins.value = newPlugins.filter((plugin) => plugin !== 'default');
      loading.value = false;
    });
}

onMounted(() => {
  reloadConfigurationsEventSubscription = ReloadConfigurationsEvent.subscribe(loadConfigurations);

  loadConfigurationDescriptions().then(loadConfigurations);
});

onUnmounted(() => {
  reloadConfigurationsEventSubscription.unsubscribe();
});
</script>
