import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import GroupsTable from 'src/components/tables/GroupsTable.vue';

installQuasarPlugin();

describe('Test component: GroupsTable', () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = shallowMount(GroupsTable, {
      props: {
        groups: [],
        showAction: true,
        removeAction: false,
        detachAction: false,
      },
    });
    await wrapper.vm.$nextTick();
  });

  describe('Test computed: displayActionsColumn', () => {
    it('should be true if showAction is true', () => {
      expect(wrapper.vm.displayActionsColumn).toBeTruthy();
    });

    it('should be true if removeAction is true', async () => {
      await wrapper.setProps({
        showAction: false,
        removeAction: true,
        detachAction: false,
      });

      expect(wrapper.vm.displayActionsColumn).toBeTruthy();
    });

    it('should be true if detachAction is true', async () => {
      await wrapper.setProps({
        showAction: false,
        removeAction: false,
        detachAction: true,
      });

      expect(wrapper.vm.displayActionsColumn).toBeTruthy();
    });

    it('should be false if remove, show and detach actions are false', async () => {
      await wrapper.setProps({
        showAction: false,
        removeAction: false,
        detachAction: false,
      });

      expect(wrapper.vm.displayActionsColumn).toBeFalsy();
    });
  });

  describe('Test computed: columns', () => {
    it('should return array with two elements when displayColumns is truthy', () => {
      expect(wrapper.vm.columns).toStrictEqual([
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          classes: 'group-name',
        },
        {
          name: 'actions',
          required: true,
          label: 'Actions',
          align: 'left',
          field: 'id',
          classes: 'group-actions',
        },
      ]);
    });

    it('should return array with one element when displayColumns is falsy', async () => {
      await wrapper.setProps({
        showAction: false,
        removeAction: false,
        detachAction: false,
      });

      expect(wrapper.vm.columns).toStrictEqual([
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          classes: 'group-name',
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

  describe('Test function: setFilterName', () => {
    it('should emit valid event', () => {
      wrapper.vm.setFilterName(5);
      expect(wrapper.emitted()).toEqual({
        onFilter: [[]],
        'update:filter-name': [[5]],
      });
    });
  });
});
