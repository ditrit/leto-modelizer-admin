import StringFilter from 'src/composables/filters/StringFilter';

describe('Test class: StringFilter', () => {
  let stringFilter;

  beforeEach(() => {
    stringFilter = new StringFilter('testStringFilter', 'serverTestStringFilter', 'queryTestStringFilter', 'default');
  });

  describe('Test constructor', () => {
    it('should create an instance of StringFilter', () => {
      expect(stringFilter).toBeInstanceOf(StringFilter);
      expect(stringFilter.filterName).toBe('testStringFilter');
      expect(stringFilter.serverName).toBe('serverTestStringFilter');
      expect(stringFilter.queryName).toBe('queryTestStringFilter');
      expect(stringFilter.defaultValue).toBe('default');
    });
  });

  describe('Test function: getFilterValue', () => {
    it('should format the value with lk_* and *', () => {
      expect(stringFilter.getFilterValue('test')).toBe('lk_*test*');
      expect(stringFilter.getFilterValue('example')).toBe('lk_*example*');
      expect(stringFilter.getFilterValue('')).toBe('lk_**');
    });
  });
});
