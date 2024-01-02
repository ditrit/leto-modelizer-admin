import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import LibrariesTable from 'src/components/tables/LibrariesTable.vue';
import * as LibraryService from 'src/services/LibraryService';
import { vi } from 'vitest';
import ReloadLibrariesEvent from 'src/composables/events/ReloadLibrariesEvent';

installQuasarPlugin();

vi.mock('src/services/LibraryService');
vi.mock('src/composables/events/ReloadLibrariesEvent');

describe('Test component: LibrariesTable', async () => {
  let wrapper;
  let subscribe;
  let unsubscribe;

  beforeEach(async () => {
    subscribe = vi.fn();
    unsubscribe = vi.fn();

    LibraryService.find.mockImplementation(() => Promise.resolve([]));

    ReloadLibrariesEvent.subscribe.mockImplementation(() => {
      subscribe();
      return { unsubscribe };
    });

    wrapper = shallowMount(LibrariesTable);
    await wrapper.vm.$nextTick();
  });

  describe('Test hook function: onMounted', () => {
    it('should subscribe DialogEvent', () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test hook function: onUnmounted', () => {
    it('should unsubscribe DialogEvent', () => {
      expect(unsubscribe).toHaveBeenCalledTimes(0);
      wrapper.unmount();
      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
