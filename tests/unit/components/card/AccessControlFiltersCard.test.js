import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { shallowMount } from '@vue/test-utils';
import { vi } from 'vitest';
import AccessControlFiltersCard from 'src/components/card/AccessControlFiltersCard.vue';

installQuasarPlugin();

vi.stubGlobal('$sanitize', true);

describe('Test component: AccessControlFiltersCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AccessControlFiltersCard, {
      props: {
        accessControlType: 'role',
      },
    });
  });

  it('should mount the component', () => {
    expect(wrapper).not.toBeNull();
  });

  describe('Test computed: translationKey', () => {
    it('should be "Role"', () => {
      expect(wrapper.vm.translationKey).toBe('Role');
    });

    it('should be "Group" when accessControlType is not "role"', async () => {
      await wrapper.setProps({
        accessControlType: 'group',
      });

      expect(wrapper.vm.translationKey).toBe('Group');
    });
  });
});
