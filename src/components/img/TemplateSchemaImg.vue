<template>
  <q-img
    v-if="templateSchema"
    :src="templateSchema"
    fit="contain"
    :alt="id"
  />
</template>

<script setup>
import * as ImageDownloadService from 'src/services/ImageDownloadService';
import { ref, onMounted } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
const templateSchema = ref(null);

/**
 * Load template schema by template id and its index.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadTemplateSchema() {
  return ImageDownloadService.getTemplateSchema(props.id, props.index)
    .then((schema) => {
      templateSchema.value = schema;
    })
    .catch(() => {
      templateSchema.value = null;
    });
}

onMounted(async () => {
  await loadTemplateSchema();
});
</script>
