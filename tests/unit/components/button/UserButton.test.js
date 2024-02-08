import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
} from 'vitest';
import UserButton from 'src/components/button/UserButton.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin();

describe('Test component: UserButton', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    wrapper = shallowMount(UserButton, {});
  });

  describe('Test computed: login', () => {
    it('Should be empty when not defined', () => {
      expect(wrapper.vm.login).toEqual('');
    });

    it('Should not be empty once defined', () => {
      store.login = 'login';
      expect(wrapper.vm.login).toEqual('login');
    });
  });

  describe('Test function: goLeto', () => {
    it('Should change location', () => {
      process.env.LETO_MODELIZER_URL = 'http://localhost:8080/';
      wrapper.vm.goLeto();
      expect(window.location.href).toEqual(process.env.LETO_MODELIZER_URL);
    });
  });
});
