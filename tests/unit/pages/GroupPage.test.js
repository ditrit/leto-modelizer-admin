import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupPage from 'pages/GroupPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import * as GroupService from 'src/services/GroupService';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('vue-router');

describe('Test component: GroupPage', () => {
  let wrapper;
  let push;

  const group = {
    id: 1,
  };

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRoute.mockImplementation(() => ({ params: { id: 'id1' } }));
    useRouter.mockImplementation(() => ({ push }));

    GroupService.findById.mockImplementation(() => Promise.resolve(group));

    wrapper = shallowMount(GroupPage);
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test function: loadGroup', () => {
    it('should set data on valid group', async () => {
      await wrapper.vm.loadGroup();

      expect(wrapper.vm.group).toEqual(group);
    });

    it('should redirect on unknown group', async () => {
      GroupService.findById.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadGroup();

      expect(push).toBeCalledWith('/groups');
    });
  });
});
