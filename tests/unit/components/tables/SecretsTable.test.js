import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import SecretsTable from 'src/components/tables/SecretsTable.vue';

installQuasarPlugin();

describe('Test component: SecretsTable', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SecretsTable, {
      props: {
        secrets: [],
        editAction: true,
        removeAction: false,
      },
    });
  });

  describe('Test computed: displayActionsColumn', () => {
    it('should be true if editAction is true', async () => {
      await wrapper.setProps({
        editAction: true,
        removeAction: false,
      });

      expect(wrapper.vm.displayActionsColumn).toBeTruthy();
    });

    it('should be true if removeAction is true', async () => {
      await wrapper.setProps({
        editAction: false,
        removeAction: true,
      });

      expect(wrapper.vm.displayActionsColumn).toBeTruthy();
    });

    it('should be false if edit and remove actions are false', async () => {
      await wrapper.setProps({
        editAction: false,
        removeAction: false,
      });

      expect(wrapper.vm.displayActionsColumn).toBeFalsy();
    });
  });

  describe('Test computed: columns', () => {
    it('should return array with "actions" column when displayActionsColumn is truthy', () => {
      expect(wrapper.vm.columns).toEqual([
        {
          name: 'key',
          required: true,
          label: 'Key',
          align: 'left',
          field: 'key',
          classes: 'secret-key',
        },
        {
          name: 'updateDate',
          required: true,
          label: 'Last update date',
          align: 'left',
          field: 'updateDate',
          classes: 'secret-updateDate',
          format: wrapper.vm.columns[1].format,
        },
        {
          name: 'actions',
          required: true,
          label: 'Actions',
          align: 'left',
          field: 'id',
          classes: 'secret-actions',
        },
      ]);
    });

    it('should return array without "actions" column when displayActionsColumn is falsy', async () => {
      await wrapper.setProps({
        editAction: false,
        removeAction: false,
      });

      expect(wrapper.vm.columns).toEqual([
        {
          name: 'key',
          required: true,
          label: 'Key',
          align: 'left',
          field: 'key',
          classes: 'secret-key',
        },
        {
          name: 'updateDate',
          required: true,
          label: 'Last update date',
          align: 'left',
          field: 'updateDate',
          classes: 'secret-updateDate',
          format: wrapper.vm.columns[1].format,
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

  describe('Test function: setFilterKey', () => {
    it('should emit valid event', () => {
      wrapper.vm.setFilterKey('test');
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:filter-key': [['test']],
      });
    });
  });
});
