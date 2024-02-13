import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import InformationLibraryTabPanel from 'src/components/tab-panel/InformationLibraryTabPanel.vue';
import * as LibraryService from 'src/services/LibraryService';
import { vi } from 'vitest';
import { Notify } from 'quasar';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('src/services/LibraryService');

describe('Test component: InformationLibraryTabPanel', async () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = shallowMount(InformationLibraryTabPanel, {
      props: {
        library: {
          id: 1,
          url: 'url',
        },
      },
    });
    await wrapper.vm.$nextTick();
  });

  describe('Test function: clearUrlError', () => {
    it('should clear url error', () => {
      wrapper.vm.urlError = true;
      wrapper.vm.urlErrorMessage = 'test';

      wrapper.vm.clearUrlError();

      expect(wrapper.vm.urlError).toEqual(false);
      expect(wrapper.vm.urlErrorMessage).toEqual('');
    });
  });

  describe('Test watcher: props.library', () => {
    it('should update value', async () => {
      await wrapper.setProps({
        library: {
          url: 'test',
        },
      });

      expect(wrapper.vm.url).toEqual('test');
    });
  });

  describe('Test function: synchronize', () => {
    it('should emit event and create success toast on success', async () => {
      LibraryService.synchronize.mockImplementation(() => Promise.resolve());
      Notify.create = vi.fn();

      await wrapper.vm.synchronize();

      expect(wrapper.emitted()).toEqual({ synchronize: [[]] });
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'positive' }));
      expect(wrapper.vm.urlError).toEqual(false);
      expect(wrapper.vm.urlErrorMessage).toEqual('');
    });

    it('should create error toast when url is not found', async () => {
      const error = {
        response: {
          data: {
            message: 'other',
          },
        },
      };
      LibraryService.synchronize.mockImplementation(() => Promise.reject(error));
      Notify.create = vi.fn();

      await wrapper.vm.synchronize();

      expect(wrapper.emitted()).toEqual({});
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
      expect(wrapper.vm.urlError).toEqual(true);
      expect(wrapper.vm.urlErrorMessage).toEqual('Library with this url can not be downloaded.');
    });

    it('should create error toast on error when url already exists', async () => {
      const error = {
        response: {
          data: {
            message: 'Library with this url already exists',
          },
        },
      };
      LibraryService.synchronize.mockImplementation(() => Promise.reject(error));
      Notify.create = vi.fn();

      await wrapper.vm.synchronize();

      expect(wrapper.emitted()).toEqual({});
      expect(Notify.create).toHaveBeenCalledWith(expect.objectContaining({ type: 'negative' }));
      expect(wrapper.vm.urlError).toEqual(true);
      expect(wrapper.vm.urlErrorMessage).toEqual('Library with this url already exists.');
    });
  });
});
