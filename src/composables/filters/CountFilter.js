import NumberFilter from 'src/composables/filters/NumberFilter';

/**
 * Class representing a count filter.
 * @augments NumberFilter
 */
class CountFilter extends NumberFilter {
  /**
   * Default constructor.
   */
  constructor() {
    super('count', 'count', 'size', 10);
  }
}

export default CountFilter;
