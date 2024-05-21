import StringFilter from 'src/composables/filters/StringFilter';

/**
 * Class representing an access control name filter.
 * @augments StringFilter
 */
class AccessControlNameFilter extends StringFilter {
  /**
   * Default constructor.
   * @param {string} type - The type of access control ('group' or 'role').
   */
  constructor(type) {
    const value = ['group', 'role'].includes(type) ? 'parentName' : 'name';

    super('name', value, 'name');
  }
}

export default AccessControlNameFilter;
