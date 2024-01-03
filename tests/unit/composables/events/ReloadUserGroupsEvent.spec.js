import ReloadUserGroupsEvent from 'src/composables/events/ReloadUserGroupsEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadUserGroupsEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadUserGroupsEvent).toBeDefined();
    expect(ReloadUserGroupsEvent).toEqual(new Subject());
  });
});
