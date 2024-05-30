import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DetachGroupFromUserDialog from 'src/components/dialog/DetachGroupFromUserDialog.vue';
import { Notify } from 'quasar';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from 'stores/UserStore';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/GroupService');
vi.mock('src/services/UserService');
vi.stubGlobal('$sanitize', true);

describe('Test component: DetachGroupFromUserDialog', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    store.login = 'login';

    wrapper = mount(DetachGroupFromUserDialog);

    wrapper.vm.group = {
      id: 'id',
    };
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });
});
