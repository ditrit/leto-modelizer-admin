import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachUserToGroupDialog from 'src/components/dialog/AttachUserToGroupDialog.vue';
import * as UserService from 'src/services/UserService';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/UserService');
vi.mock('src/services/GroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachUserToGroupDialog', () => {
  let wrapper;

  beforeEach(() => {
    UserService.find.mockImplementation(() => Promise.resolve({ content: ['users'] }));

    wrapper = mount(AttachUserToGroupDialog);
  });

  describe('Test function: search', () => {
    it('should set users', async () => {
      wrapper.vm.users = [];

      await wrapper.vm.search();

      expect(wrapper.vm.users).toEqual(['users']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ id: '1' }, { id: '2' }];
      wrapper.vm.groupId = 'groupId';
    });

    it('should send positive notification after attaching users to group', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach users to group', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndUser.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
