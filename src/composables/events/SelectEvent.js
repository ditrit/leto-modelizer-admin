import { Subject } from 'rxjs';

/**
 * Represent a rxjs Event object to emit and to receive events about selected users.
 * @typedef {Subject} SelectUsersEvent
 */
const SelectUsersEvent = new Subject();

/**
 * Represent a rxjs Event object to emit and to receive events about selected roles.
 * @typedef {Subject} SelectRolesEvent
 */
const SelectRolesEvent = new Subject();

export default {
  SelectUsersEvent,
  SelectRolesEvent,
};
