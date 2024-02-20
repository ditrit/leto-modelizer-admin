import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachUserFromGroupDialog from 'src/components/dialog/DetachUserFromGroupDialog.vue';
import * as GroupService from 'src/services/GroupService';
import * as UserService from 'src/services/UserService';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('src/services/UserService');
vi.stubGlobal('$sanitize', true);

describe('Test component: DetachUserFromGroupDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    wrapper = mount(DetachUserFromGroupDialog);

    wrapper.vm.group = {
      id: 'id',
    };
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after detaching group from user', async () => {
      Notify.create = vi.fn();
      wrapper.vm.user = {
        login: 'id',
      };
      GroupService.dissociateGroupAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should update permissions for current user', async () => {
      wrapper.vm.user = {
        login: 'userLogin',
      };
      store.login = 'userLogin';
      store.permissions = null;

      GroupService.dissociateGroupAndUser.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
