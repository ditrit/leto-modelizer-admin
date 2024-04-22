import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import { useClientSidePagination } from 'src/composables/ClientSidePagination';

vi.mock('vue-i18n');

describe('Test: ClientSidePagination', () => {
  let wrapper;
  const items = [1, 2, 3];

  beforeEach(() => {
    wrapper = mount({
      template: '<div id="clientSidePagination"/>',
      setup() {
        return useClientSidePagination(items);
      },
    });

    wrapper.vm.currentPage = 1;
    wrapper.vm.itemsPerPage = 10;
  });

  describe('Test computed: paginatedItems', () => {
    it('should return sliced version of items array depending on the value of itemsPerPage and currentPage', () => {
      expect(wrapper.vm.paginatedItems).toEqual([1, 2, 3]);

      wrapper.vm.currentPage = 1;
      wrapper.vm.itemsPerPage = 2;

      expect(wrapper.vm.paginatedItems).toEqual([1, 2]);

      wrapper.vm.currentPage = 2;
      wrapper.vm.itemsPerPage = 2;

      expect(wrapper.vm.paginatedItems).toEqual([3]);
    });
  });

  describe('Test computed: pages', () => {
    it('should return number of pages that depends on the value of itemsPerPage and the length of items.', () => {
      expect(wrapper.vm.pages).toEqual(1);

      wrapper.vm.itemsPerPage = 1;

      expect(wrapper.vm.pages).toEqual(3);
    });
  });
});
