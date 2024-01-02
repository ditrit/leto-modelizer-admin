import ReloadUsersEvent from 'src/composables/events/ReloadUsersEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadUsersEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadUsersEvent).toBeDefined();
    expect(ReloadUsersEvent).toEqual(new Subject());
  });
});
