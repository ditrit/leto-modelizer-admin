import CountFilter from 'src/composables/filters/CountFilter';

describe('Test class: CountFilter', () => {
  let countFilter;

  beforeEach(() => {
    countFilter = new CountFilter();
  });

  describe('Test constructor', () => {
    it('should create an instance of CountFilter', () => {
      expect(countFilter).toBeInstanceOf(CountFilter);
      expect(countFilter.filterName).toBe('count');
      expect(countFilter.serverName).toBe('count');
      expect(countFilter.queryName).toBe('size');
      expect(countFilter.defaultValue).toBe(10);
    });
  });

  describe('Test function: getValueFromUrl', () => {
    it('should return value if it is not the default', () => {
      expect(countFilter.getFilterValue(5)).toBe(5);
      expect(countFilter.getFilterValue(20)).toBe(20);
    });

    it('should return null if value is the default', () => {
      expect(countFilter.getFilterValue(10)).toBe(null);
    });
  });

  describe('Test function: isDefaultValue', () => {
    it('should return true for default value', () => {
      expect(countFilter.isDefaultValue(10)).toBe(true);
    });

    it('should return false for non-default value', () => {
      expect(countFilter.isDefaultValue(5)).toBe(false);
      expect(countFilter.isDefaultValue(20)).toBe(false);
    });
  });
});
