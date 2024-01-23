import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the groups attached to a user.
 * @typedef {Subject} ReloadUserAttachedGroupsEvent
 */
const ReloadUserAttachedGroupsEvent = new Subject();

export default ReloadUserAttachedGroupsEvent;
