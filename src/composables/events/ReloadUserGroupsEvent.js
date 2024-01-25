import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the groups attached to a user.
 * @typedef {Subject} ReloadUserGroupsEvent
 */
const ReloadUserGroupsEvent = new Subject();

export default ReloadUserGroupsEvent;
