import StringFilter from 'src/composables/filters/StringFilter';

class AccessControlNameFilter extends StringFilter {
  constructor(type) {
    const value = ['group', 'role'].includes(type) ? 'parentName' : 'name';

    super('name', value, 'name');
  }
}

export default AccessControlNameFilter;
