<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        {{ $t('SecretFiltersCard.text.title') }}
      </span>
      <q-input
        outlined
        dense
        clearable
        :model-value="secretKey"
        :label="$t('SecretFiltersCard.text.byKey')"
        :debounce="inputDebounceTime"
        class="q-mr-sm"
        data-cy="secret_filter_key"
        @update:model-value="(value) => $emit('update:secretKey', value)"
      >
        <template #prepend>
          <q-icon :name="$t('SecretFiltersCard.icon.byKey')" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['update:secretKey']);
defineProps({
  secretKey: {
    type: String,
    default: '',
  },
});
const inputDebounceTime = ref(process.env.INPUT_DEBOUNCE_TIME);
</script>
