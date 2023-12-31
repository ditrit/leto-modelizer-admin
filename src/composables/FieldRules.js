import { useI18n } from 'vue-i18n';

/**
 * Composable that provides rules for field.
 * @param {string} key - Component name for translation.
 * @returns {object} Object with all rules, each rule is a Function .
 */
export function useFieldRules(key) {
  const { t } = useI18n();

  /**
   * Check if value is not empty.
   * @param {string} value - Value to check.
   * @returns {boolean | string} Return true if the value is not empty otherwise the translated
   * error message.
   */
  function notEmpty(value) {
    return (value && value.length > 0) || t(`${key}.text.notEmpty`);
  }

  return { notEmpty };
}
