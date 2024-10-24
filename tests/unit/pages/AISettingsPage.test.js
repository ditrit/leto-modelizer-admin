import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import AISettingsPage from 'pages/AISettingsPage.vue';
import { Notify } from 'quasar';
import { vi } from 'vitest';
import { useRoute, useRouter } from 'vue-router';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-router');

describe('Test component: AISettingsPage', () => {
  let wrapper;
  let push;

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();

    useRoute.mockImplementation(() => ({
      query: {
        tab: 'secrets',
      },
    }));

    useRouter.mockImplementation(() => ({ push }));

    wrapper = shallowMount(AISettingsPage);
  });

  describe('Test computed: currentTab', () => {
    it('should be "secrets"', () => {
      expect(wrapper.vm.currentTab).toBe('secrets');
    });

    it('should be "configurations" when route.query.tab is undefined', () => {
      useRoute.mockImplementation(() => ({
        params: { login: 'id1' },
        query: {},
      }));

      wrapper = shallowMount(AISettingsPage);

      expect(wrapper.vm.currentTab).toBe('configurations');
    });
  });

  describe('Test function: updateUrl', () => {
    it('should update the URL with current tab query params', () => {
      wrapper.vm.tabsQuery = { secrets: { page: 1 } };

      wrapper.vm.updateUrl('secrets');

      expect(push).toBeCalledWith('/ai?tab=secrets&page=1');
    });
  });

  describe('Test function: setTabsQuery', () => {
    it('should set tabsQuery and call updateUrl', () => {
      wrapper.vm.tabsQuery = {
        configurations: {},
        secrets: {},
      };

      wrapper.vm.setTabsQuery('secrets', { page: 1 });

      expect(wrapper.vm.tabsQuery).toEqual({
        configurations: {},
        secrets: { page: 1 },
      });
      expect(push).toBeCalledWith('/ai?tab=secrets&page=1');
    });
  });
});
