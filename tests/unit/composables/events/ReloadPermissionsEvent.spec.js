import ReloadPermissionsEvent from 'src/composables/events/ReloadPermissionsEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadPermissionsEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadPermissionsEvent).toBeDefined();
    expect(ReloadPermissionsEvent).toEqual(new Subject());
  });
});
