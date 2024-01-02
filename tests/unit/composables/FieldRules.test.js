import { mount } from '@vue/test-utils';
import { useI18n } from 'vue-i18n';
import { vi } from 'vitest';
import { useFieldRules } from 'src/composables/FieldRules';

vi.mock('vue-i18n');

describe('Test: FieldRules', () => {
  let wrapper;

  useI18n.mockImplementation(() => ({
    t: (v) => v,
  }));

  beforeEach(() => {
    wrapper = mount({
      template: '<div id="fieldRules"/>',
      setup() {
        return useFieldRules('test');
      },
    });
  });

  describe('Test function: notEmpty', () => {
    it('should return error text when the value is null', () => {
      expect(wrapper.vm.notEmpty(null)).toEqual('test.text.notEmpty');
    });

    it('should return error text when the value is undefined', () => {
      expect(wrapper.vm.notEmpty(undefined)).toEqual('test.text.notEmpty');
    });

    it('should return error text when the value is empty', () => {
      expect(wrapper.vm.notEmpty('')).toEqual('test.text.notEmpty');
    });

    it('should return true when the value is not empty', () => {
      expect(wrapper.vm.notEmpty('a')).toEqual(true);
    });
  });
});
