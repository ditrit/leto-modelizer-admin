import PageFilter from 'src/composables/filters/PageFilter';

describe('Test class: PageFilter', () => {
  let pageFilter;

  beforeEach(() => {
    pageFilter = new PageFilter();
  });

  describe('Test constructor', () => {
    it('should create an instance of PageFilter', () => {
      expect(pageFilter).toBeInstanceOf(PageFilter);
      expect(pageFilter.filterName).toBe('page');
      expect(pageFilter.serverName).toBe('page');
      expect(pageFilter.queryName).toBe('page');
      expect(pageFilter.defaultValue).toBe(0);
    });
  });

  describe('Test function: getFilterValue', () => {
    it('should convert 1-indexed page to 0-indexed', () => {
      expect(pageFilter.getFilterValue(1)).toBe(0);
      expect(pageFilter.getFilterValue(2)).toBe(1);
      expect(pageFilter.getFilterValue(5)).toBe(4);
    });

    it('should return null for invalid page numbers', () => {
      expect(pageFilter.getFilterValue(0)).toBe(null);
      expect(pageFilter.getFilterValue(-1)).toBe(null);
    });
  });

  describe('Test function: isDefaultValue', () => {
    it('should return true for default values', () => {
      expect(pageFilter.isDefaultValue(0)).toBe(true);
      expect(pageFilter.isDefaultValue(1)).toBe(true);
    });

    it('should return false for non-default values', () => {
      expect(pageFilter.isDefaultValue(2)).toBe(false);
      expect(pageFilter.isDefaultValue(5)).toBe(false);
    });
  });
});
