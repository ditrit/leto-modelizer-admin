import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import AddLibraryPage from 'pages/AddLibraryPage.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';
import * as LibraryService from 'src/services/LibraryService';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';

installQuasarPlugin({
  plugins: [Notify],
});

vi.mock('vue-i18n');
vi.mock('vue-router');
vi.mock('src/services/LibraryService');

describe('Test component: AddLibraryPage', () => {
  let wrapper;
  let push;

  useI18n.mockImplementation(() => ({
    t: (v) => v,
  }));

  beforeEach(() => {
    Notify.create = vi.fn();
    push = vi.fn();
    useRouter.mockImplementation(() => ({ push }));

    wrapper = shallowMount(AddLibraryPage);
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

  describe('Test function: clearRoleError', () => {
    it('should clear role name error', () => {
      wrapper.vm.roleError = true;
      wrapper.vm.roleMessage = 'test';

      wrapper.vm.clearRoleError();

      expect(wrapper.vm.roleError).toEqual(false);
      expect(wrapper.vm.roleErrorMessage).toEqual('');
    });
  });

  describe('Test function: onSubmit', () => {
    it('should clear error', async () => {
      wrapper.vm.roleError = true;
      wrapper.vm.roleMessage = 'test';
      wrapper.vm.urlError = true;
      wrapper.vm.urlErrorMessage = 'test';

      LibraryService.create.mockImplementation(() => Promise.resolve({ id: 'test' }));

      await wrapper.vm.onSubmit();

      expect(wrapper.vm.urlError).toEqual(false);
      expect(wrapper.vm.urlErrorMessage).toEqual('');
      expect(wrapper.vm.roleError).toEqual(false);
      expect(wrapper.vm.roleErrorMessage).toEqual('');
    });

    it('should create the library and go to its page', async () => {
      LibraryService.create.mockImplementation(() => Promise.resolve({ id: 'test' }));

      await wrapper.vm.onSubmit();

      expect(push).toBeCalledWith('/libraries/test');
    });

    it('should set the "url already exists" error when this error is thrown', async () => {
      const error = {
        response: {
          data: {
            message: 'Library with this url already exists',
          },
        },
      };
      LibraryService.create.mockImplementation(() => Promise.reject(error));

      await wrapper.vm.onSubmit();

      expect(push).not.toBeCalled();
      expect(wrapper.vm.urlError).toEqual(true);
      expect(wrapper.vm.urlErrorMessage).toEqual('AddLibraryPage.text.urlAlreadyExists');
      expect(wrapper.vm.roleError).toEqual(false);
      expect(wrapper.vm.roleErrorMessage).toEqual('');
    });

    it('should set the "role name already exists" error when this error is thrown', async () => {
      const error = {
        response: {
          data: {
            message: 'Library with this role already exists',
          },
        },
      };
      LibraryService.create.mockImplementation(() => Promise.reject(error));

      await wrapper.vm.onSubmit();

      expect(push).not.toBeCalled();
      expect(wrapper.vm.urlError).toEqual(false);
      expect(wrapper.vm.urlErrorMessage).toEqual('');
      expect(wrapper.vm.roleError).toEqual(true);
      expect(wrapper.vm.roleErrorMessage).toEqual('AddLibraryPage.text.roleAlreadyExists');
    });

    it('should set the "url not found" error for all other errors thrown', async () => {
      const error = {
        response: {
          data: {
            message: 'error',
          },
        },
      };
      LibraryService.create.mockImplementation(() => Promise.reject(error));

      await wrapper.vm.onSubmit();

      expect(push).not.toBeCalled();
      expect(wrapper.vm.urlError).toEqual(true);
      expect(wrapper.vm.urlErrorMessage).toEqual('AddLibraryPage.text.urlNotFound');
      expect(wrapper.vm.roleError).toEqual(false);
      expect(wrapper.vm.roleErrorMessage).toEqual('');
    });
  });
});
