import NumberFilter from 'src/composables/filters/NumberFilter';

class CountFilter extends NumberFilter {
  constructor() {
    super('count', 'count', 'size', 10);
  }

  getFilterValue(value) {
    return value !== 10 ? value : null;
  }

  isDefaultValue(value) {
    return value === 10;
  }
}

export default CountFilter;
