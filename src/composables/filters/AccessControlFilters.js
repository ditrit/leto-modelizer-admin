import AccessControlNameFilter from 'src/composables/filters/AccessControlNameFilter';
import PageFilter from 'src/composables/filters/PageFilter';
import CountFilter from 'src/composables/filters/CountFilter';

/**
 * Create an array of access control filters.
 * @param {string} type - The type of access control ('group' or 'role').
 * @returns {Array} An array of filter instances for access control.
 */
export default function accessControlFilters(type = '') {
  return [
    new PageFilter(),
    new CountFilter(),
    new AccessControlNameFilter(type),
  ];
}
