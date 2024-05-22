<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        {{ $t('PermissionFiltersCard.text.filters') }}
      </span>
      <q-select
        outlined
        dense
        clearable
        :model-value="entity"
        :options="entityOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        :label="$t('PermissionFiltersCard.text.entity')"
        class="q-mr-sm select-field"
        data-cy="permission_filter_entity"
        @update:model-value="(value) => $emit('update:entity', value)"
      >
        <template #prepend>
          <q-icon :name="$t('PermissionFiltersCard.icon.entity')" />
        </template>
        <template #option="{ opt, selected, toggleOption }">
          <q-item
            :active="selected"
            clickable
            @click="toggleOption(opt)"
          >
            <q-item-section :data-cy="`permission_entity_${opt.label}`">
              {{ opt.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        outlined
        dense
        clearable
        :model-value="action"
        :options="actionOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        :label="$t('PermissionFiltersCard.text.action')"
        class="q-mr-sm select-field"
        data-cy="permission_filter_action"
        @update:model-value="(value) => $emit('update:action', value)"
      >
        <template #option="{ opt, selected, toggleOption }">
          <q-item
            :active="selected"
            clickable
            @click="toggleOption(opt)"
          >
            <q-item-section :data-cy="`permission_action_${opt.label}`">
              {{ opt.label }}
            </q-item-section>
          </q-item>
        </template>
        <template #prepend>
          <q-icon :name="$t('PermissionFiltersCard.icon.action')" />
        </template>
      </q-select>
      <q-select
        outlined
        dense
        clearable
        :model-value="libraryName"
        :options="libraryOptions"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        :debounce="inputDebounceTime"
        :label="$t('PermissionFiltersCard.text.libraryId')"
        class="select-field"
        data-cy="permission_filter_libraryId"
        @input-value="setLibraryName"
        @filter="filterLibrary"
        @clear="libraryName = ''"
        @update:model-value="(value) => $emit('update:library-id', value)"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t('PermissionFiltersCard.text.noResults') }}
            </q-item-section>
          </q-item>
        </template>
        <template #option="{ opt, selected, toggleOption }">
          <q-item
            :active="selected"
            clickable
            @click="toggleOption(opt)"
          >
            <q-item-section :data-cy="`permission_libraryId_${opt.label}`">
              {{ opt.label }}
            </q-item-section>
          </q-item>
        </template>
        <template #prepend>
          <q-icon :name="$t('PermissionFiltersCard.icon.libraryId')" />
        </template>
      </q-select>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import * as LibraryService from 'src/services/LibraryService';

defineEmits(['update:entity', 'update:action', 'update:library-id']);
defineProps({
  entity: {
    type: String,
    default: '',
  },
  action: {
    type: String,
    default: '',
  },
  libraryId: {
    type: String,
    default: '',
  },
});

const { t } = useI18n();
const inputDebounceTime = ref(process.env.INPUT_DEBOUNCE_TIME);
const libraryName = ref('');
const libraryOptions = ref([]);
const actionOptions = computed(() => [
  {
    label: t('Permissions.text.CREATE'),
    value: 'CREATE',
  },
  {
    label: t('Permissions.text.DELETE'),
    value: 'DELETE',
  },
  {
    label: t('Permissions.text.UPDATE'),
    value: 'UPDATE',
  },
  {
    label: t('Permissions.text.ACCESS'),
    value: 'ACCESS',
  },
]);
const entityOptions = computed(() => [
  {
    label: t('Permissions.text.ADMIN'),
    value: 'ADMIN',
  },
  {
    label: t('Permissions.text.PROJECT'),
    value: 'PROJECT',
  },
  {
    label: t('Permissions.text.COMPONENT'),
    value: 'COMPONENT',
  },
  {
    label: t('Permissions.text.DIAGRAM'),
    value: 'DIAGRAM',
  },
  {
    label: t('Permissions.text.LIBRARY'),
    value: 'LIBRARY',
  },
  {
    label: t('Permissions.text.PROJECT_TEMPLATE'),
    value: 'PROJECT_TEMPLATE',
  },
  {
    label: t('Permissions.text.COMPONENT_TEMPLATE'),
    value: 'COMPONENT_TEMPLATE',
  },
  {
    label: t('Permissions.text.DIAGRAM_TEMPLATE'),
    value: 'DIAGRAM_TEMPLATE',
  },
]);

/**
 * Filters the library options based on a given label.
 * @param {object} searchText - Search text.
 * @param {Function} update - Update function used to update the state
 * with the filtered library options. It should accept an async callback function as its argument.
 */
async function filterLibrary(searchText, update) {
  await LibraryService.find({
    name: searchText !== '' ? `lk_*${searchText}*` : undefined,
    count: 5,
  }).then((data) => {
    libraryOptions.value = data.content.map((library) => ({
      label: library.name,
      value: library.id,
    }));

    update();
  });
}

/**
 * Set LibraryName.
 * @param {string} name - Library name from field.
 */
function setLibraryName(name) {
  libraryName.value = name;
}
</script>

<style scoped>
.select-field {
  min-width: 200px;
}
</style>
