import NumberFilter from 'src/composables/filters/NumberFilter';

describe('Test class: NumberFilter', () => {
  let numberFilter;

  beforeEach(() => {
    numberFilter = new NumberFilter('testNumberFilter', 'serverTestNumberFilter', 'queryTestNumberFilter', 42);
  });

  describe('Test constructor', () => {
    it('should create an instance of NumberFilter', () => {
      expect(numberFilter).toBeInstanceOf(NumberFilter);
      expect(numberFilter.filterName).toBe('testNumberFilter');
      expect(numberFilter.serverName).toBe('serverTestNumberFilter');
      expect(numberFilter.queryName).toBe('queryTestNumberFilter');
      expect(numberFilter.defaultValue).toBe(42);
    });
  });

  describe('Test function: getValueFromUrl', () => {
    it('should parse string value to integer', () => {
      expect(numberFilter.getValueFromUrl('123')).toBe(123);
      expect(numberFilter.getValueFromUrl('456')).toBe(456);
    });

    it('should return default value for invalid input', () => {
      expect(numberFilter.getValueFromUrl('abc')).toBe(42);
      expect(numberFilter.getValueFromUrl('')).toBe(42);
      expect(numberFilter.getValueFromUrl(null)).toBe(42);
      expect(numberFilter.getValueFromUrl(undefined)).toBe(42);
    });
  });
});
