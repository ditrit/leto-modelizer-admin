<template>
  <q-card
    class="default-AI-configuration-card"
    data-cy="default-AI-configuration-card"
  >
    <q-card-section class="text-h6">
      {{ $t('DefaultAIConfigurationCard.text.title') }}
    </q-card-section>
    <q-form
      class="column flex-1"
      @submit="onSubmitNewPlugin"
    >
      <q-card-section class="text-subtitle2">
        {{ $t('DefaultAIConfigurationCard.text.addPlugin') }}
      </q-card-section>
      <q-card-section class="row">
        <q-input
          v-model="newPluginName"
          outlined
          class="plugin-input q-mr-md"
          :rules="[notEmpty]"
          :label="$t('DefaultAIConfigurationCard.text.newPluginNameLabel')"
          :hint="$t('DefaultAIConfigurationCard.text.newPluginNameHint')"
          data-cy="input-new-plugin-name"
        />
        <q-select
          v-model="newPluginHandler"
          outlined
          class="handler-select"
          :options="handlers"
          :rules="[notEmpty]"
          :label="$t('DefaultAIConfigurationCard.text.newPluginHandler')"
          data-cy="select-new-plugin-handler"
        >
          <template #option="{ selected, opt, toggleOption }">
            <q-item
              :active="selected"
              clickable
              @click="toggleOption(opt)"
            >
              <q-item-section :data-cy="`item_${opt}`">
                {{ opt }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          :label="$t('DefaultAIConfigurationCard.text.save')"
          :loading="submitting"
          type="submit"
          color="positive"
          data-cy="button_save-plugin"
        >
          <template #loading>
            <q-spinner-hourglass />
          </template>
        </q-btn>
      </q-card-actions>
    </q-form>
    <q-form
      v-if="plugins.length > 0"
      @submit="onSubmitUpdate"
    >
      <q-separator />
      <q-card-section class="text-subtitle2">
        {{ $t('DefaultAIConfigurationCard.text.editPlugin') }}
      </q-card-section>
      <q-card-section
        v-for="plugin in plugins"
        :key="plugin"
        class="row justify-center items-center content-center"
      >
        <q-select
          v-model="pluginPreferences[plugin].value"
          outlined
          class="handler-select q-mr-md"
          :options="handlers"
          :label="plugin"
          :data-cy="`select-${plugin}`"
        >
          <template #option="{ selected, opt, toggleOption }">
            <q-item
              :active="selected"
              clickable
              @click="toggleOption(opt)"
            >
              <q-item-section :data-cy="`item_${opt}`">
                {{ opt }}
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-btn
          fab-mini
          :loading="submitting"
          color="negative"
          :data-cy="`button_${plugin}_delete`"
          @click="deleteConfiguration(pluginPreferences[plugin].id)"
        >
          <template #default>
            <q-icon
              :name="$t('DefaultAIConfigurationCard.icon.delete')"
              size="xs"
            />
          </template>
          <template #loading>
            <q-spinner-hourglass />
          </template>
        </q-btn>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          :label="$t('DefaultAIConfigurationCard.text.update')"
          :loading="submitting"
          type="submit"
          color="positive"
          data-cy="button_update"
        >
          <template #loading>
            <q-spinner-hourglass />
          </template>
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useFieldRules } from 'src/composables/FieldRules';
import * as ConfigurationService from 'src/services/ConfigurationService';
import ReloadConfigurationsEvent from 'src/composables/events/ReloadConfigurationsEvent';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  handlers: {
    type: Array,
    default: () => [],
  },
  configurations: {
    type: Array,
    default: () => [],
  },
});

const { t } = useI18n();
const { notEmpty } = useFieldRules('DefaultAIConfigurationCard');
const submitting = ref(false);
const newPluginName = ref('');
const newPluginHandler = ref('');
const pluginPreferences = ref({});
const plugins = ref([]);

/**
 * Initialize names of plugin from general configuration.
 */
function initPlugins() {
  const keyPart = 'plugin.preferences.';
  const pluginPreferencesObject = {};
  const pluginArray = [];

  props.configurations
    .filter(({ key }) => key.indexOf(keyPart) === 0)
    .forEach(({ id, key, value }) => {
      const plugin = key.substring(keyPart.length);

      pluginPreferencesObject[plugin] = { id, key, value };
      pluginArray.push(plugin);
    });

  pluginPreferences.value = pluginPreferencesObject;
  plugins.value = pluginArray;
}

/**
 * Delete configuration by id.
 * @param {string} id - Id of configuration to delete.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function deleteConfiguration(id) {
  submitting.value = true;

  return ConfigurationService.deleteById(id)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('DefaultAIConfigurationCard.text.notifyDeleteSuccess'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
      ReloadConfigurationsEvent.next();
    });
}

/**
 * Create new plugin configuration for an AI model.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmitNewPlugin() {
  submitting.value = true;

  return ConfigurationService.add({
    handler: null,
    key: `plugin.preferences.${newPluginName.value}`,
    value: newPluginHandler.value,
  })
    .then(() => {
      newPluginName.value = '';
      newPluginHandler.value = '';
      Notify.create({
        type: 'positive',
        message: t('DefaultAIConfigurationCard.text.notifySaveSuccess'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
      ReloadConfigurationsEvent.next();
    });
}

/**
 * Update plugins configuration for AI models.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmitUpdate() {
  submitting.value = true;
  const data = Object.keys(pluginPreferences.value).map((key) => pluginPreferences.value[key]);

  return ConfigurationService.updateAll(data)
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('DefaultAIConfigurationCard.text.notifyUpdateSuccess'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
      ReloadConfigurationsEvent.next();
    });
}

watch(() => props.configurations, initPlugins, { deep: true, immediate: true });

onMounted(() => {
  initPlugins();
});
</script>

<style scoped>
.default-AI-configuration-card {
  display: inline-flex;
  flex-direction: column;
}
.handler-select, .plugin-input {
  width: 250px;
  min-width: 250px;
}
</style>
