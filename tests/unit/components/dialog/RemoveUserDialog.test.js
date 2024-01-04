import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import RemoveUserDialog from 'src/components/dialog/RemoveUserDialog.vue';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import * as UserAuthentication from 'src/composables/UserAuthentication';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/composables/UserAuthentication');
vi.stubGlobal('$sanitize', true);

describe('Test component: RemoveUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    Notify.create = vi.fn();
    wrapper = mount(RemoveUserDialog);
  });

  describe('Test function: onSubmit', () => {
    it('should remove user', async () => {
      wrapper.vm.user = { objectId: 'test' };
      wrapper.vm.currentUser = { objectId: 'current' };
      UserService.remove.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(UserService.remove).toBeCalledWith('test');
    });

    it('should call removeUserSessionToken if removing current user', async () => {
      UserAuthentication.removeUserSessionToken.mockImplementation(() => 'removeUserSessionToken');

      wrapper.vm.user = { objectId: 'test' };
      wrapper.vm.currentUser = { objectId: 'test' };

      await wrapper.vm.onSubmit();

      expect(UserAuthentication.removeUserSessionToken).toBeCalled();
    });
  });

  describe('Test hook function: onMounted', () => {
    it('should call getUserSessionToken', () => {
      UserAuthentication.getUserSessionToken.mockImplementation(() => 'sessionToken');

      expect(UserAuthentication.getUserSessionToken).toBeCalled();
    });
  });
});
