import ReloadGroupsEvent from 'src/composables/events/ReloadGroupsEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadGroupsEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadGroupsEvent).toBeDefined();
    expect(ReloadGroupsEvent).toEqual(new Subject());
  });
});
