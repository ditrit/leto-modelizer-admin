import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the libraries table.
 * @typedef {Subject} ReloadLibrariesEvent
 */
const ReloadLibrariesEvent = new Subject();

export default ReloadLibrariesEvent;
