import Filter from 'src/composables/filters/Filter';

class NumberFilter extends Filter {
  constructor(filterName, serverName, queryName, defaultValue = 0) {
    super(filterName, serverName, queryName, defaultValue);
  }

  getValueFromUrl(value) {
    return parseInt(value, 10) || this.defaultValue;
  }
}

export default NumberFilter;
