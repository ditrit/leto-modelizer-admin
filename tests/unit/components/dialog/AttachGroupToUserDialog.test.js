import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachGroupToUserDialog from 'src/components/dialog/AttachGroupToUserDialog.vue';
import * as UserService from 'src/services/UserService';
import * as UserGroupService from 'src/services/UserGroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/services/UserGroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachGroupToUserDialog', () => {
  let wrapper;

  beforeEach(() => {
    UserGroupService.find.mockImplementation(() => Promise.resolve(['group']));

    wrapper = mount(AttachGroupToUserDialog);
  });

  describe('Test function: search', () => {
    it('should set userGroups', async () => {
      wrapper.vm.userGroups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.userGroups).toEqual(['group']);
    });
  });

  describe('Test function: onSubmit', () => {
    it('should send positive notification after attaching groups to user', async () => {
      Notify.create = vi.fn();
      UserService.attachGroups.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach groups to user', async () => {
      Notify.create = vi.fn();
      UserService.attachGroups.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
