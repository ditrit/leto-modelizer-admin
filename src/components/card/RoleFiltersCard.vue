<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        Filters
      </span>
      <q-input
        outlined
        dense
        :model-value="name"
        label="by name"
        debounce="2000"
        data-cy="role_filter_name"
        @update:model-value="(value) => $emit('update:name', value)"
      >
        <template #prepend>
          <q-icon name="fa-solid fa-magnifying-glass" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineEmits(['update:name']);
defineProps({
  name: {
    type: String,
    default: '',
  },
});
</script>
