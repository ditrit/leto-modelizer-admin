import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachGroupToUserDialog from 'src/components/dialog/AttachGroupToUserDialog.vue';
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

describe('Test component: AttachGroupToUserDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    GroupService.find.mockImplementation(() => Promise.resolve({ content: ['group'] }));

    wrapper = mount(AttachGroupToUserDialog);
  });

  describe('Test function: search', () => {
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(['group']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ id: '1' }, { id: '2' }];
      wrapper.vm.userLogin = 'userLogin';
    });

    it('should send positive notification after attaching groups to user', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach groups to user', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });

    it('should update permissions for current user', async () => {
      wrapper.vm.userLogin = 'userLogin';
      store.login = 'userLogin';
      store.permissions = null;

      GroupService.associateGroupAndUser.mockImplementation(() => Promise.resolve());
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve({ action: 'ACTION', entity: 'ENTITY' }));

      await wrapper.vm.onSubmit();

      expect(store.permissions).toEqual({ action: 'ACTION', entity: 'ENTITY' });
    });
  });
});
