import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the roles list.
 * @typedef {Subject} ReloadRolesEvent
 */
const ReloadRolesEvent = new Subject();

export default ReloadRolesEvent;
