import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    login: '',
    name: '',
    email: '',
    permissions: [],
    ready: false,
  }),
});
