import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import AttachGroupToGroupDialog from 'src/components/dialog/AttachGroupToGroupDialog.vue';
import * as GroupService from 'src/services/GroupService';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.stubGlobal('$sanitize', true);

describe('Test component: AttachGroupToGroupDialog', () => {
  let wrapper;

  beforeEach(() => {
    GroupService.find.mockImplementation(() => Promise.resolve({ content: ['groups'] }));

    wrapper = mount(AttachGroupToGroupDialog);
  });

  describe('Test function: search', () => {
    it('should set groups', async () => {
      wrapper.vm.groups = [];

      await wrapper.vm.search();

      expect(wrapper.vm.groups).toEqual(['groups']);
    });
  });

  describe('Test function: onSubmit', () => {
    beforeEach(() => {
      wrapper.vm.selected = [{ id: '1' }, { id: '2' }];
      wrapper.vm.groupId = 'groupId';
    });

    it('should send positive notification after attaching groups to group', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndGroup.mockImplementation(() => Promise.resolve());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
    });

    it('should send negative notification after failing to attach users to group', async () => {
      Notify.create = vi.fn();
      GroupService.associateGroupAndGroup.mockImplementation(() => Promise.reject());

      await wrapper.vm.onSubmit();

      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
    });
  });
});
