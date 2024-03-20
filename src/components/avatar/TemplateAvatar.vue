<template>
  <q-avatar
    color="white"
    text-color="white"
    :size="small ? 'sm' : 'md'"
    :font-size="small ? '10px' : '12px'"
    :title="id"
  >
    <q-img
      v-if="templateIcon"
      :src="templateIcon"
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
const templateIcon = ref(null);

/**
 * Load template icon by its id.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadTemplateIcon() {
  return ImageDownloadService.getTemplateIcon(props.id)
    .then((icon) => {
      templateIcon.value = icon;
    })
    .catch(() => {
      templateIcon.value = null;
    });
}

onMounted(async () => {
  await loadTemplateIcon();
});
</script>
