import NumberFilter from 'src/composables/filters/NumberFilter';

class PageFilter extends NumberFilter {
  constructor() {
    super('page', 'page', 'page', 0);
  }

  getFilterValue(value) {
    return value >= 1 ? value - 1 : null;
  }

  isDefaultValue(value) {
    return value <= 1;
  }
}

export default PageFilter;
