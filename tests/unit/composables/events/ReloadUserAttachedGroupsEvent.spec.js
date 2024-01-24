import ReloadUserAttachedGroupsEvent from 'src/composables/events/ReloadUserAttachedGroupsEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadUserAttachedGroupsEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadUserAttachedGroupsEvent).toBeDefined();
    expect(ReloadUserAttachedGroupsEvent).toEqual(new Subject());
  });
});
