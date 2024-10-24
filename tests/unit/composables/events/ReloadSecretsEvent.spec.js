import ReloadSecretsEvent from 'src/composables/events/ReloadSecretsEvent';
import { Subject } from 'rxjs';

describe('Test composable: ReloadSecretsEvent', () => {
  it('should export a Subject', () => {
    expect(ReloadSecretsEvent).toBeDefined();
    expect(ReloadSecretsEvent).toEqual(new Subject());
  });
});
