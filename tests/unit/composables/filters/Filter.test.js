import Filter from 'src/composables/filters/Filter';

describe('Test class: Filter', () => {
  let filter;

  beforeEach(() => {
    filter = new Filter('testFilter', 'serverTestFilter', 'queryTestFilter', 'default');
  });

  describe('Test constructor', () => {
    it('should create an instance of Filter', () => {
      expect(filter).toBeInstanceOf(Filter);
      expect(filter.filterName).toBe('testFilter');
      expect(filter.serverName).toBe('serverTestFilter');
      expect(filter.queryName).toBe('queryTestFilter');
      expect(filter.defaultValue).toBe('default');
    });
  });

  describe('Test function: getFilterValue', () => {
    it('should return null if the value is the default value', () => {
      const value = 'default';

      expect(filter.getFilterValue(value)).toBe(null);
    });

    it('should return the value passed to it', () => {
      const value = 'someValue';

      expect(filter.getFilterValue(value)).toBe(value);
    });
  });

  describe('Test function: getValueFromUrl', () => {
    it('should return the value passed to it', () => {
      const value = 'urlValue';

      expect(filter.getValueFromUrl(value)).toBe(value);
    });
  });

  describe('Test function: isDefaultValue', () => {
    it('should return true for default value', () => {
      expect(filter.isDefaultValue('default')).toBe(true);
    });

    it('should return true for null value', () => {
      expect(filter.isDefaultValue(null)).toBe(true);
    });

    it('should return false for non-default value', () => {
      expect(filter.isDefaultValue('test')).toBe(false);
      expect(filter.isDefaultValue(false)).toBe(false);
      expect(filter.isDefaultValue('')).toBe(false);
      expect(filter.isDefaultValue(0)).toBe(false);
      expect(filter.isDefaultValue(123)).toBe(false);
      expect(filter.isDefaultValue([])).toBe(false);
    });
  });
});
