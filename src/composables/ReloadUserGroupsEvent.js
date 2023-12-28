import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the userGroups table.
 * @typedef {Subject} ReloadUserGroupsEvent
 */
const ReloadUserGroupsEvent = new Subject();

export default ReloadUserGroupsEvent;
