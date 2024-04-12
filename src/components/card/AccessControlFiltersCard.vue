<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        {{ $t(`${translationKey}FiltersCard.text.title`) }}
      </span>
      <q-input
        outlined
        dense
        clearable
        :model-value="name"
        :label="$t(`${translationKey}FiltersCard.text.byName`)"
        :debounce="inputDebounceTime"
        :data-cy="`${accessControlType}_filter_name`"
        @update:model-value="(value) => $emit('update:name', value)"
      >
        <template #prepend>
          <q-icon :name="$t(`${translationKey}FiltersCard.icon.byName`)" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';

defineEmits(['update:name']);
const props = defineProps({
  accessControlType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: '',
  },
});
const inputDebounceTime = ref(process.env.INPUT_DEBOUNCE_TIME);
const translationKey = computed(() => (props.accessControlType === 'role' ? 'Role' : 'Group'));
</script>
