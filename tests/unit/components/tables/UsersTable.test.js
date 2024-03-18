import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import UsersTable from 'src/components/tables/UsersTable.vue';

installQuasarPlugin();

describe('Test component: UsersTable', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(UsersTable, {
      props: {
        users: [],
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
    it('should return array with "actions" column when displayActionsColumn is truthy', () => {
      expect(wrapper.vm.columns).toStrictEqual([
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          classes: 'user-name',
        },
        {
          name: 'login',
          required: true,
          label: 'Login',
          align: 'left',
          field: 'login',
          classes: 'user-login',
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: 'email',
          classes: 'user-email',
        },
        {
          name: 'actions',
          required: true,
          label: 'Actions',
          align: 'left',
          field: 'login',
          classes: 'user-actions',
        },
      ]);
    });

    it('should return array without "actions" column when displayActionsColumn is falsy', async () => {
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
          classes: 'user-name',
        },
        {
          name: 'login',
          required: true,
          label: 'Login',
          align: 'left',
          field: 'login',
          classes: 'user-login',
        },
        {
          name: 'email',
          required: true,
          label: 'Email',
          align: 'left',
          field: 'email',
          classes: 'user-email',
        },
      ]);
    });
  });
});
