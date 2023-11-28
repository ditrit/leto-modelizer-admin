import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    username: '',
    firstname: '',
    roles: [],
    ready: false,
  }),
  getters: {
    isEmpty: (state) => state.username.length === 0 && state.firstname.length === 0,
  },
});
