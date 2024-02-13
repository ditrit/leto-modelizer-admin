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
      {{ login.at(0) }}
    </template>
  </q-avatar>
</template>

<script setup>
import * as UserService from 'src/services/UserService';
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
const userPicture = ref('');

onMounted(async () => {
  userPicture.value = await UserService.getPictureByLogin(props.login);
});
</script>
