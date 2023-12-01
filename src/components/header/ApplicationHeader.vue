<template>
  <q-header
    class="bg-primary text-white shadow-1 row justify-between items-center q-px-lg text-h5"
    data-cy="application-header"
  >
    <div>
      <q-img class="logo" />
      <label
        class="vertical-middle text-subtitle1 cursor-pointer text-white"
        data-cy="application-name"
      >
        {{ $t('ApplicationHeader.text.applicationName') }}
      </label>
    </div>
    <div class="project-info">
      <h5
        class="application-title q-ma-none"
        data-cy="application-title"
      >
        {{ $t('ApplicationHeader.text.title') }}
      </h5>
    </div>
    <div class="row justify-between items-center">
      <user-button />
    </div>
  </q-header>
</template>

<script setup>
import UserButton from 'components/button/UserButton.vue';
</script>
