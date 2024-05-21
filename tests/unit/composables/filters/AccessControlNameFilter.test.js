import AccessControlNameFilter from 'src/composables/filters/AccessControlNameFilter';

describe('Test class: AccessControlNameFilter', () => {
  describe('Test constructor', () => {
    it('should create an instance of AccessControlNameFilter with parentName as serverName when type is group', () => {
      const groupFilter = new AccessControlNameFilter('group');
      expect(groupFilter).toBeInstanceOf(AccessControlNameFilter);
      expect(groupFilter.filterName).toBe('name');
      expect(groupFilter.serverName).toBe('parentName');
      expect(groupFilter.queryName).toBe('name');

      const roleFilter = new AccessControlNameFilter('role');
      expect(roleFilter).toBeInstanceOf(AccessControlNameFilter);
      expect(roleFilter.filterName).toBe('name');
      expect(roleFilter.serverName).toBe('parentName');
      expect(roleFilter.queryName).toBe('name');
    });

    it('should create an instance of AccessControlNameFilter with name as serverName when type is not group or role', () => {
      const otherFilter = new AccessControlNameFilter('other');
      expect(otherFilter).toBeInstanceOf(AccessControlNameFilter);
      expect(otherFilter.filterName).toBe('name');
      expect(otherFilter.serverName).toBe('name');
      expect(otherFilter.queryName).toBe('name');
    });
  });
});
