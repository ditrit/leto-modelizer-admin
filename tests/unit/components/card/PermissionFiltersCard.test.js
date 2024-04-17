import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import { vi } from 'vitest';
import PermissionFiltersCard from 'src/components/card/PermissionFiltersCard.vue';
import * as LibraryService from 'src/services/LibraryService';

installQuasarPlugin();

vi.stubGlobal('$sanitize', true);
vi.mock('src/services/LibraryService');

describe('Test component: PermissionFiltersCard', () => {
  let wrapper;

  beforeEach(() => {
    LibraryService.find.mockImplementation(() => Promise.resolve({ content: [{ name: 'Library_1', id: 1 }] }));

    wrapper = shallowMount(PermissionFiltersCard, {
      props: {
        entity: 'entity',
        action: 'action',
        libraryId: 'libraryId',
      },
    });
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test computed: actionOptions', () => {
    it('should be array of object with label and value keys', () => {
      expect(wrapper.vm.actionOptions).toStrictEqual([
        {
          label: 'Create',
          value: 'CREATE',
        },
        {
          label: 'Delete',
          value: 'DELETE',
        },
        {
          label: 'Update',
          value: 'UPDATE',
        },
        {
          label: 'Access',
          value: 'ACCESS',
        },
      ]);
    });
  });

  describe('Test computed: entityOptions', () => {
    it('should be array of object with label and value keys', () => {
      expect(wrapper.vm.entityOptions).toStrictEqual([
        {
          label: 'Administration application',
          value: 'ADMIN',
        },
        {
          label: 'Project',
          value: 'PROJECT',
        },
        {
          label: 'Component',
          value: 'COMPONENT',
        },
        {
          label: 'Diagram',
          value: 'DIAGRAM',
        },
        {
          label: 'Library',
          value: 'LIBRARY',
        },
        {
          label: 'Project template',
          value: 'PROJECT_TEMPLATE',
        },
        {
          label: 'Component template',
          value: 'COMPONENT_TEMPLATE',
        },
        {
          label: 'Diagram template',
          value: 'DIAGRAM_TEMPLATE',
        },
      ]);
    });
  });

  describe('Test function: filterLibrary', () => {
    it('should update libraryOptions when search Text is empty', async () => {
      wrapper.vm.libraryOptions = [];

      const update = vi.fn();

      await wrapper.vm.filterLibrary('', update);

      expect(update).toHaveBeenCalled();
      expect(wrapper.vm.libraryOptions).toEqual([{ label: 'Library_1', value: 1 }]);
    });

    it('should update libraryOptions when search Text is not empty', async () => {
      wrapper.vm.libraryOptions = [];

      const update = vi.fn();

      await wrapper.vm.filterLibrary('lib', update);

      expect(update).toHaveBeenCalled();
      expect(wrapper.vm.libraryOptions).toEqual([{ label: 'Library_1', value: 1 }]);
    });
  });

  describe('Test function: setLibraryName', () => {
    it('should call attach permission to role', async () => {
      wrapper.vm.libraryName = '';

      wrapper.vm.setLibraryName('name');

      expect(wrapper.vm.libraryName).toEqual('name');
    });
  });
});
