import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import UserAvatar from 'src/components/avatar/UserAvatar.vue';
import * as UserService from 'src/services/UserService';

installQuasarPlugin();

vi.mock('src/services/UserService');

describe('Test component: UserAvatar', () => {
  let wrapper;

  beforeEach(() => {
    UserService.getPictureByLogin.mockImplementation(() => Promise.resolve('picture'));

    wrapper = shallowMount(UserAvatar, {
      props: {
        login: 'Login',
        small: false,
      },
    });
  });

  describe('Test function: loadUserPicture', () => {
    it('Should set userPicture', async () => {
      await wrapper.vm.loadUserPicture();

      expect(wrapper.vm.userPicture).toEqual('picture');
    });

    it('Should set userPicture to null if request fails', async () => {
      UserService.getPictureByLogin.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadUserPicture();

      expect(wrapper.vm.userPicture).toEqual(null);
    });
  });
});
