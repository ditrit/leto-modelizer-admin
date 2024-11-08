<template>
  <q-card
    class="custom-AI-configuration-card"
    :data-cy="`${handler}_custom-AI-configuration-card`"
  >
    <q-card-section class="text-h6">
      {{ $t('CustomAIConfigurationCard.text.title', { handler }) }}
    </q-card-section>
    <q-form
      class="column flex-1"
      @submit="onSubmit"
    >
      <q-card-section
        v-for="field in defaultFields"
        :key="field.key"
        class="q-py-sm q-px-md"
      >
        <template v-if="field.type === 'text' || field.type === 'textarea'">
          <q-input
            v-model="field.value"
            outlined
            :label="field.label"
            :title="field.title"
            :hint="field.description"
            :rules="[field.required ? notEmpty : () => true]"
            :type="field.type"
            :class="`field-${field.type}`"
            :data-cy="`input_${handler}_${field.key}`"
          />
        </template>
        <template v-else>
          <q-select
            v-model="field.value"
            outlined
            :options="field.values"
            :label="field.label"
            :title="field.title"
            :hint="field.description"
            :rules="[field.required ? notEmpty : () => true]"
            :class="`field-${field.type}`"
            :data-cy="`select_${handler}_${field.key}`"
          />
        </template>
      </q-card-section>
      <q-card-section>
        <q-list bordered>
          <q-expansion-item
            v-for="plugin in plugins"
            :key="`${plugin}-configuration`"
            switch-toggle-side
            group="plugins"
            :label="$t('CustomAIConfigurationCard.text.pluginTitle', { plugin })"
            :data-cy="`expansion-item_${handler}_${plugin}`"
          >
            <q-card bordered>
              <q-card-section
                v-for="field in pluginFields[plugin]"
                :key="field.key"
                class="q-py-sm q-px-md"
              >
                <template v-if="field.type === 'text' || field.type === 'textarea'">
                  <q-input
                    v-model="field.value"
                    outlined
                    :label="nunjucks.renderString(field.label, { plugin })"
                    :title="nunjucks.renderString(field.title, { plugin })"
                    :hint="nunjucks.renderString(field.description, { plugin })"
                    :rules="[field.required ? notEmpty : () => true]"
                    :type="field.type"
                    :class="`field-${field.type}`"
                    :data-cy="`input_${handler}_${plugin}_${field.key}`"
                  />
                </template>
                <template v-else>
                  <q-select
                    v-model="field.value"
                    outlined
                    :options="field.values"
                    :label="nunjucks.renderString(field.label, { plugin })"
                    :title="nunjucks.renderString(field.title, { plugin })"
                    :hint="nunjucks.renderString(field.description, { plugin })"
                    :rules="[field.required ? notEmpty : () => true]"
                    :class="`field-${field.type}`"
                    :data-cy="`select_${handler}_${plugin}_${field.key}`"
                  />
                </template>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
      <q-card-actions class="justify-end">
        <q-btn
          :label="$t('CustomAIConfigurationCard.text.save')"
          :loading="submitting"
          type="submit"
          color="positive"
          data-cy="button_save"
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
import nunjucks from 'nunjucks';
import { Notify } from 'quasar';
import ReloadConfigurationsEvent from 'src/composables/events/ReloadConfigurationsEvent';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  handler: {
    type: String,
    default: () => '',
  },
  descriptions: {
    type: Array,
    default: () => [],
  },
  configurations: {
    type: Array,
    default: () => [],
  },
  plugins: {
    type: Array,
    default: () => [],
  },
});

const { t } = useI18n();
const { notEmpty } = useFieldRules('CustomAIConfigurationCard');
const submitting = ref(false);
const defaultFields = ref([]);
const pluginFields = ref({});

/**
 * Initialize fields from descriptions.
 */
function initFields() {
  const newDefaultFields = [];
  const newPluginFields = {};

  props.descriptions
    .filter(({ pluginDependent }) => !pluginDependent)
    .forEach((description) => {
      const configuration = props.configurations.find(({ key }) => key === description.key);

      newDefaultFields.push({
        ...description,
        id: configuration?.id || null,
        value: configuration?.value || description.defaultValue,
      });
    });

  props.plugins
    .forEach((plugin) => {
      newPluginFields[plugin] = [];

      props.descriptions
        .filter(({ pluginDependent }) => pluginDependent)
        .forEach((description) => {
          const key = nunjucks.renderString(description.key, { plugin });
          const configuration = props.configurations.find((config) => config.key === key);

          newPluginFields[plugin].push({
            ...description,
            key,
            id: configuration?.id || null,
            value: configuration?.value || description.defaultValue,
          });
        });
    });

  defaultFields.value = newDefaultFields;
  pluginFields.value = newPluginFields;
}

/**
 * Update, create or delete configurations from updated fields.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function onSubmit() {
  submitting.value = true;
  const configurationsToCreate = [];
  const configurationsToUpdate = [];
  const configurationsToDelete = [];

  defaultFields.value.forEach((field) => {
    if (field.id && field.value !== '') {
      configurationsToUpdate.push({
        id: field.id,
        key: field.key,
        value: field.value,
        handler: field.handler,
      });
    } else if (field.id) {
      configurationsToDelete.push(field.id);
    } else if (field.value !== '') {
      configurationsToCreate.push({
        key: field.key,
        value: field.value,
        handler: field.handler,
      });
    }
  });

  props.plugins.forEach((plugin) => {
    pluginFields.value[plugin].forEach((field) => {
      if (field.id && field.value !== '') {
        configurationsToUpdate.push({
          id: field.id,
          key: field.key,
          value: field.value,
          handler: field.handler,
        });
      } else if (field.id) {
        configurationsToDelete.push(field.id);
      } else if (field.value !== '') {
        configurationsToCreate.push({
          key: field.key,
          value: field.value,
          handler: field.handler,
        });
      }
    });
  });

  return Promise.allSettled([
    ConfigurationService.updateAll(configurationsToUpdate),
    ...configurationsToCreate.map((c) => ConfigurationService.add(c)),
    ...configurationsToDelete.map((id) => ConfigurationService.deleteById(id)),
  ])
    .then(() => {
      Notify.create({
        type: 'positive',
        message: t('CustomAIConfigurationCard.text.notifySaveSuccess'),
        html: true,
      });
    })
    .finally(() => {
      submitting.value = false;
      ReloadConfigurationsEvent.next();
    });
}

watch(() => props.configurations, initFields, { deep: true, immediate: true });
watch(() => props.plugins, initFields, { deep: true, immediate: true });

onMounted(() => {
  initFields();
});
</script>

<style scoped>
.custom-AI-configuration-card {
  display: inline-flex;
  flex-direction: column;
}
.field-textarea {
  width: 500px;
  min-width: 500px;
}
</style>
