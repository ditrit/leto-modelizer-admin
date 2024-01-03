import ReloadLibrariesEvent from 'src/composables/events/ReloadLibrariesEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadLibrariesEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadLibrariesEvent).toBeDefined();
    expect(ReloadLibrariesEvent).toEqual(new Subject());
  });
});
