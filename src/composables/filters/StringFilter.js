import Filter from 'src/composables/filters/Filter';

class StringFilter extends Filter {
  constructor(filterName, serverName, queryName, defaultValue = '') {
    super(filterName, serverName, queryName, defaultValue);
  }

  getFilterValue(value) {
    return `lk_*${value}*`;
  }
}

export default StringFilter;
