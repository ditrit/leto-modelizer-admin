<template>
  <q-card>
    <q-card-section class="row justify-center items-center">
      <span class="text-weight-medium q-mr-md">
        {{ $t('UserFiltersCard.text.filters') }}
      </span>
      <q-input
        outlined
        dense
        clearable
        :model-value="name"
        :label="$t('UserFiltersCard.text.name')"
        :debounce="inputDebounceTime"
        class="q-mr-sm"
        data-cy="user_filter_name"
        @update:model-value="(value) => $emit('update:name', value)"
      >
        <template #prepend>
          <q-icon :name="$t('UserFiltersCard.icon.name')" />
        </template>
      </q-input>
      <q-input
        outlined
        dense
        clearable
        :model-value="login"
        :label="$t('UserFiltersCard.text.login')"
        :debounce="inputDebounceTime"
        class="q-mr-sm"
        data-cy="user_filter_login"
        @update:model-value="(value) => $emit('update:login', value)"
      >
        <template #prepend>
          <q-icon :name="$t('UserFiltersCard.icon.login')" />
        </template>
      </q-input>
      <q-input
        outlined
        dense
        clearable
        :model-value="email"
        :label="$t('UserFiltersCard.text.email')"
        :debounce="inputDebounceTime"
        data-cy="user_filter_email"
        @update:model-value="(value) => $emit('update:email', value)"
      >
        <template #prepend>
          <q-icon :name="$t('UserFiltersCard.icon.email')" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['update:name', 'update:login', 'update:email']);
defineProps({
  name: {
    type: String,
    default: '',
  },
  login: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
});
const inputDebounceTime = ref(process.env.INPUT_DEBOUNCE_TIME);
</script>
