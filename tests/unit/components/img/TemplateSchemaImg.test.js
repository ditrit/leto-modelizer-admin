import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import * as ImageDownloadService from 'src/services/ImageDownloadService';
import TemplateSchemaImg from 'components/img/TemplateSchemaImg.vue';

installQuasarPlugin();

vi.mock('src/services/ImageDownloadService');

describe('Test component: TemplateSchemaImg', () => {
  let wrapper;

  beforeEach(() => {
    ImageDownloadService.getTemplateSchema.mockImplementation(() => Promise.resolve('picture'));

    wrapper = shallowMount(TemplateSchemaImg, {
      props: {
        id: 'id',
        index: 0,
      },
    });
  });

  describe('Test function: loadTemplateSchema', () => {
    it('Should set templateSchema', async () => {
      await wrapper.vm.loadTemplateSchema();

      expect(wrapper.vm.templateSchema).toEqual('picture');
    });

    it('Should set templateIcon to null if request fails', async () => {
      ImageDownloadService.getTemplateSchema.mockImplementation(() => Promise.reject());

      await wrapper.vm.loadTemplateSchema();

      expect(wrapper.vm.templateSchema).toEqual(null);
    });
  });
});
