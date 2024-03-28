import SelectEvent from 'src/composables/events/SelectEvent';
import { Subject } from 'rxjs';

describe('Test composable: SelectEvent', () => {
  describe('Test event: SelectUsersEvent', () => {
    it('should export a Subject', () => {
      expect(SelectEvent.SelectUsersEvent).toBeDefined();
      expect(SelectEvent.SelectUsersEvent).toEqual(new Subject());
    });
  });

  describe('Test event: SelectRolesEvent', () => {
    it('should export a Subject', () => {
      expect(SelectEvent.SelectRolesEvent).toBeDefined();
      expect(SelectEvent.SelectRolesEvent).toEqual(new Subject());
    });
  });
});
