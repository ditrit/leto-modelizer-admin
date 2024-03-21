<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        Filters
      </span>
      <q-input
        outlined
        :model-value="name"
        label="by name"
        debounce="2000"
        @update:model-value="(value) => $emit('update:name', value)"
        data-cy="role_filter_name"
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
