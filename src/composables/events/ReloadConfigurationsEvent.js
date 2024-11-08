import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events to force reloading
 * the configurations.
 * @typedef {Subject} ReloadConfigurationsEvent
 */
const ReloadConfigurationsEvent = new Subject();

export default ReloadConfigurationsEvent;
