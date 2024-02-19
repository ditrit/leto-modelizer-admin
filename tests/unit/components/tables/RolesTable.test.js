import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import RolesTable from 'src/components/tables/RolesTable.vue';

installQuasarPlugin();

describe('Test component: RolesTable', async () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RolesTable, {
      props: {
        roles: [],
        showAction: true,
        removeAction: false,
        detachAction: false,
      },
    });
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
          classes: 'role-name',
        },
        {
          name: 'actions',
          required: true,
          label: 'Actions',
          align: 'left',
          field: 'id',
          classes: 'role-actions',
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
          classes: 'role-name',
        },
      ]);
    });
  });
});
