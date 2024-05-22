import { mount } from '@vue/test-utils';
import { useI18n } from 'vue-i18n';
import { vi } from 'vitest';
import { useServerSideFilter } from 'src/composables/ServerSideFilter';

vi.mock('vue-i18n');

describe('Test: ServerSideFilter', () => {
  let wrapper;

  useI18n.mockImplementation(() => ({
    t: (v) => v,
  }));

  beforeEach(() => {
    wrapper = mount({
      template: '<div id="ServerSideFilter"/>',
      setup() {
        return useServerSideFilter([
          {
            filterName: 'name',
            queryName: 'name',
            serverName: 'name',
            defaultValue: '',
            getFilterValue: (value) => `lk_*${value}*`,
            getValueFromUrl: (value) => value,
            isDefaultValue: (value) => value?.length === 0 || !value,
          },
          {
            filterName: 'page',
            queryName: 'page',
            serverName: 'page',
            defaultValue: 0,
            getFilterValue: (value) => (value >= 1 ? value - 1 : null),
            getValueFromUrl: (value) => parseInt(value, 10) || 0,
            isDefaultValue: (value) => value <= 1,
          },
          {
            filterName: 'count',
            queryName: 'size',
            serverName: 'count',
            defaultValue: 10,
            getFilterValue: (value) => (value !== 10 ? value : null),
            getValueFromUrl: (value) => parseInt(value, 10) || 10,
            isDefaultValue: (value) => value === 10,
          },
        ]);
      },
    });
  });

  describe('Test function: getFilters', () => {
    it('should return object with no filters', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 0,
        name: '',
      };

      expect(wrapper.vm.getFilters()).toEqual({});
    });

    it('should return object with name filter', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 0,
        name: 'test',
      };

      expect(wrapper.vm.getFilters()).toEqual({ name: 'lk_*test*' });
    });

    it('should return object with page filter', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 2,
        name: '',
      };

      expect(wrapper.vm.getFilters()).toEqual({ page: '1' });
    });

    it('should return object with count filter', () => {
      wrapper.vm.filters = {
        count: 5,
        page: 0,
        name: '',
      };

      expect(wrapper.vm.getFilters()).toEqual({ count: '5' });
    });

    it('should return object with all filters', () => {
      wrapper.vm.filters = {
        count: 5,
        page: 2,
        name: 'userName',
      };

      expect(wrapper.vm.getFilters()).toEqual({
        count: '5',
        page: '1',
        name: 'lk_*userName*',
      });
    });
  });

  describe('Test function: init', () => {
    it('should update filters correctly', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: 'userName',
      };

      wrapper.vm.init({ size: '5', page: '2', name: 'newName' });

      expect(wrapper.vm.filters).toEqual({
        count: 5,
        page: 2,
        name: 'newName',
      });
    });

    it('should not update filters if query is an empty object', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: 'userName',
      };

      wrapper.vm.init({});

      expect(wrapper.vm.filters).toEqual({
        count: 10,
        page: 1,
        name: 'userName',
      });
    });

    it('should not update filters if query is undefined', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: 'userName',
      };

      wrapper.vm.init();

      expect(wrapper.vm.filters).toEqual({
        count: 10,
        page: 1,
        name: 'userName',
      });
    });
  });

  describe('Test function: generateQuery', () => {
    it('should return an empty query when filters are set to their default values', () => {
      wrapper.vm.filters = {
        count: 10,
        page: 1,
        name: '',
      };

      const queryParameters = wrapper.vm.generateQuery();

      expect(queryParameters).toEqual({});
    });

    it('should return a query object when filters are not set to their default values', () => {
      wrapper.vm.filters = {
        count: 5,
        page: 2,
        name: 'userName',
      };

      const queryParameters = wrapper.vm.generateQuery({});

      expect(queryParameters).toEqual({
        size: 5,
        page: 2,
        name: 'userName',
      });
    });
  });
});
