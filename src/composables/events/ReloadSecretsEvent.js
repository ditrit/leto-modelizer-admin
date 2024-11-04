import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the secrets table.
 * @typedef {Subject} ReloadSecretsEvent
 */
const ReloadSecretsEvent = new Subject();

export default ReloadSecretsEvent;
