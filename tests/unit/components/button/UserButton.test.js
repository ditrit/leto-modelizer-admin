import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
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
    wrapper = mount(UserButton, {});
  });

  describe('Test computed: firstname', () => {
    it('Should be empty when not defined', () => {
      expect(wrapper.vm.firstname).toEqual('');
    });

    it('Should not be empty once defined', () => {
      store.firstname = 'firstname';
      expect(wrapper.vm.firstname).toEqual('firstname');
    });
  });

  describe('Test computed: username', () => {
    it('Should be empty when not defined', () => {
      expect(wrapper.vm.username).toEqual('');
    });

    it('Should not be empty once defined', () => {
      store.username = 'username';
      expect(wrapper.vm.username).toEqual('username');
    });
  });

  describe('Test computed: userInitials', () => {
    it('Should be empty when not defined', () => {
      expect(wrapper.vm.userInitials).toEqual('');
    });

    it('Should not be empty once defined', () => {
      store.firstname = 'abcd';
      store.username = 'bcde';
      expect(wrapper.vm.userInitials).toEqual('AB');
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
