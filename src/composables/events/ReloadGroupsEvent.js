import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the groups table.
 * @typedef {Subject} ReloadGroupsEvent
 */
const ReloadGroupsEvent = new Subject();

export default ReloadGroupsEvent;
