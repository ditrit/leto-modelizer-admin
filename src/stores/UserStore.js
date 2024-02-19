import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    login: '',
    name: '',
    email: '',
    permissions: [],
    ready: false,
  }),
  getters: {
    isAdmin: (state) => state.permissions.some(({ action, entity }) => action === 'ACCESS' && entity === 'ADMIN'),
  },
});
