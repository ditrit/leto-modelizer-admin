import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachUserFromGroupDialog from 'src/components/dialog/DetachUserFromGroupDialog.vue';
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

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
