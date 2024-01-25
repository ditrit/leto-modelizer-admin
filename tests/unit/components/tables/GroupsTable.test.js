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
      });

      expect(wrapper.vm.displayActionsColumn).toBeTruthy();
    });

    it('should be false if removeAction and showAction are false', async () => {
      await wrapper.setProps({
        showAction: false,
        removeAction: false,
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
          field: 'objectId',
          classes: 'group-actions',
        },
      ]);
    });

    it('should return array with one element when displayColumns is falsy', async () => {
      await wrapper.setProps({
        showAction: false,
        removeAction: false,
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
});
