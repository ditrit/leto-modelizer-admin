import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  beforeEach,
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

  describe('Test hook function: onMounted', () => {
    it('Should set userPicture', () => {
      expect(wrapper.vm.userPicture).toEqual('picture');
    });
  });
});
