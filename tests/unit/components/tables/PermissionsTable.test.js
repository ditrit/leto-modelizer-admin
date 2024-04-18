import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import PermissionsTable from 'src/components/tables/PermissionsTable.vue';

installQuasarPlugin();

describe('Test component: PermissionsTable', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PermissionsTable, {
      props: {
        permissions: [],
        detachAction: true,
      },
    });
  });

  describe('Test computed: columns', () => {
    it('should return array with "actions" column when props.detachAction is truthy', () => {
      expect(wrapper.vm.columns).toStrictEqual([
        {
          name: 'entity',
          required: true,
          label: 'Entity',
          align: 'left',
          field: 'entity',
          classes: 'permission-entity',
        },
        {
          name: 'action',
          required: true,
          label: 'Operation',
          align: 'left',
          field: 'action',
          classes: 'permission-action',
        },
        {
          name: 'key',
          required: true,
          label: 'Description',
          align: 'left',
          field: 'key',
          classes: 'permission-key',
        },
        {
          name: 'actions',
          required: true,
          label: 'Actions',
          align: 'left',
          field: 'id',
          classes: 'permission-actions',
        },
      ]);
    });

    it('should return array without "actions" column when props.detachAction is falsy', async () => {
      await wrapper.setProps({
        detachAction: false,
      });

      expect(wrapper.vm.columns).toStrictEqual([
        {
          name: 'entity',
          required: true,
          label: 'Entity',
          align: 'left',
          field: 'entity',
          classes: 'permission-entity',
        },
        {
          name: 'action',
          required: true,
          label: 'Operation',
          align: 'left',
          field: 'action',
          classes: 'permission-action',
        },
        {
          name: 'key',
          required: true,
          label: 'Description',
          align: 'left',
          field: 'key',
          classes: 'permission-key',
        },
      ]);
    });
  });

  describe('Test function: setCurrentPage', () => {
    it('should emit valid event', () => {
      wrapper.vm.setCurrentPage(5);
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:current-page': [[5]],
      });
    });
  });

  describe('Test function: setElementsPerPage', () => {
    it('should emit valid event', () => {
      wrapper.vm.setElementsPerPage(5);
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:elements-per-page': [[5]],
      });
    });
  });

  describe('Test function: setFilterEntity', () => {
    it('should emit valid event', () => {
      wrapper.vm.setFilterEntity(5);
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:filter-entity': [[5]],
      });
    });
  });

  describe('Test function: setFilterAction', () => {
    it('should emit valid event', () => {
      wrapper.vm.setFilterAction(5);
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:filter-action': [[5]],
      });
    });
  });

  describe('Test function: setFilterLibraryId', () => {
    it('should emit valid event', () => {
      wrapper.vm.setFilterLibraryId(5);
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:filter-library-id': [[5]],
      });
    });
  });
});
