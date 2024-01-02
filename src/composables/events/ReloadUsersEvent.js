import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the users table.
 * @typedef {Subject} ReloadUsersEvent
 */
const ReloadUsersEvent = new Subject();

export default ReloadUsersEvent;
