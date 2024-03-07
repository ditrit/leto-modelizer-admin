<template>
  <q-avatar
    color="primary"
    text-color="white"
    :size="small ? 'sm' : 'md'"
    :font-size="small ? '10px' : '12px'"
    :title="id"
  >
    <q-img
      v-if="libraryIcon"
      :src="libraryIcon"
      :alt="id"
      width="85%"
    />
  </q-avatar>
</template>

<script setup>
import * as ImageDownloadService from 'src/services/ImageDownloadService';
import { ref, onMounted } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  small: {
    type: Boolean,
    default: false,
  },
});
const libraryIcon = ref(null);

/**
 * Load library icon by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadLibraryIcon() {
  return ImageDownloadService.getLibraryIcon(props.id)
    .then((icon) => {
      libraryIcon.value = icon;
    })
    .catch(() => {
      libraryIcon.value = null;
    });
}

onMounted(async () => {
  await loadLibraryIcon();
});
</script>
