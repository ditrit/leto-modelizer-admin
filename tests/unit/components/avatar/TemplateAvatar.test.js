import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import * as ImageDownloadService from 'src/services/ImageDownloadService';
import TemplateAvatar from 'components/avatar/TemplateAvatar.vue';

installQuasarPlugin();

vi.mock('src/services/ImageDownloadService');

describe('Test component: TemplateAvatar', () => {
  let wrapper;

  beforeEach(() => {
    ImageDownloadService.getTemplateIcon.mockImplementation(() => Promise.resolve('picture'));

    wrapper = shallowMount(TemplateAvatar, {
      props: {
        id: 'id',
      },
    });
  });

  describe('Test function: loadTemplateIcon', () => {
    it('Should set templateIcon', async () => {
      await wrapper.vm.loadTemplateIcon();

      expect(wrapper.vm.templateIcon).toEqual('picture');
    });

    it('Should set templateIcon to null if request fails', async () => {
      ImageDownloadService.getTemplateIcon.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadTemplateIcon();

      expect(wrapper.vm.templateIcon).toEqual(null);
    });
  });
});
