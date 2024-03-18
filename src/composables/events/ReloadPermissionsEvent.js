import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the permissions table.
 * @typedef {Subject} ReloadPermissionsEvent
 */
const ReloadPermissionsEvent = new Subject();

export default ReloadPermissionsEvent;
