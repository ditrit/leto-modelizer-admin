import ReloadRolesEvent from 'src/composables/events/ReloadRolesEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadRolesEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadRolesEvent).toBeDefined();
    expect(ReloadRolesEvent).toEqual(new Subject());
  });
});
