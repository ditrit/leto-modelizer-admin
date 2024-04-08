<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        {{ $t('GroupFiltersCard.text.title') }}
      </span>
      <q-input
        outlined
        dense
        clearable
        :model-value="name"
        :label="$t('GroupFiltersCard.text.byName')"
        :debounce="inputDebounceTime"
        data-cy="group_filter_name"
        @update:model-value="(value) => $emit('update:name', value)"
      >
        <template #prepend>
          <q-icon :name="$t('GroupFiltersCard.icon.byName')" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['update:name']);
defineProps({
  name: {
    type: String,
    default: '',
  },
});
const inputDebounceTime = ref(process.env.INPUT_DEBOUNCE_TIME);
</script>
