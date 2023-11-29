<template>
  <q-footer class="bg-primary col">
    <q-toolbar class="row justify-center footer">
      <a
        :href="$sanitize(`https://github.com/ditrit/leto-modelizer-admin/releases/tag/${version}`)"
        class="text-white q-ml-md"
        target="_blank"
      >
        {{ $t('footer.version', { version }) }}
      </a>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue';

const version = ref(process.env.VERSION);
</script>
