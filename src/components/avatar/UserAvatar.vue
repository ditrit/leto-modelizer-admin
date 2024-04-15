<template>
  <q-avatar
    color="primary"
    text-color="white"
    :size="small ? 'sm' : 'md'"
    :font-size="small ? '10px' : '12px'"
    :title="login"
  >
    <q-img
      v-if="userPicture"
      :src="userPicture"
      :alt="login"
    />
    <template v-else>
      {{ login.at(0).toUpperCase() }}
    </template>
  </q-avatar>
</template>

<script setup>
import * as ImageDownloadService from 'src/services/ImageDownloadService';
import { ref, onMounted } from 'vue';

const props = defineProps({
  login: {
    type: String,
    required: true,
  },
  small: {
    type: Boolean,
    default: false,
  },
});
const userPicture = ref(null);

/**
 * Load user picture by its login.
 * @returns {Promise<void>} Promise with nothing on success.
 */
async function loadUserPicture() {
  return ImageDownloadService.getUserPicture(props.login)
    .then((picture) => {
      userPicture.value = picture;
    })
    .catch(() => {
      userPicture.value = null;
    });
}

onMounted(async () => {
  loadUserPicture();
});
</script>
