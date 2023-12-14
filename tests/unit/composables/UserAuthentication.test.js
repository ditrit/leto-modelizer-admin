import {
  setUserSessionToken,
  getUserSessionToken, initUser,
} from 'src/composables/UserAuthentication';
import * as UserService from 'src/services/UserService';
import * as RoleService from 'src/services/RoleService';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';
import { vi } from 'vitest';

vi.mock('src/services/UserService');
vi.mock('src/services/RoleService');

describe('Test: User Authentication', () => {
  describe('Test function: setUserSessionToken', () => {
    it('should set the session token in the local storage', () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem');

      setUserSessionToken('MySessionToken');

      expect(setItem).toHaveBeenCalledWith('sessionToken', 'MySessionToken');
    });
  });

  describe('Test function: getUserSessionToken', () => {
    it('should get the session token from the local storage', () => {
      const getItem = vi.spyOn(Storage.prototype, 'getItem');

      getUserSessionToken();

      expect(getItem).toHaveBeenCalledWith('sessionToken');
    });
  });

  describe('Test function: initUser', () => {
    it('should do nothing if user is already initialized', async () => {
      setActivePinia(createPinia());

      const store = useUserStore();

      store.ready = true;
      UserService.findCurrent.mockImplementation(() => Promise.resolve());

      await initUser('userId', 'tempCode');

      expect(UserService.findCurrent).not.toBeCalled();
    });

    it('should initialize user information and role if user has admin role but has not been initialized yet', async () => {
      setActivePinia(createPinia());

      const store = useUserStore();

      UserService.findCurrent.mockImplementation(() => Promise.resolve({
        objectId: 'a',
        username: 'b',
        firstname: 'c',
      }));

      RoleService.findByUserId.mockImplementation(() => Promise.resolve([{ name: 'admin' }]));

      await initUser('userId', 'tempCode');

      expect(store.id).toEqual('a');
      expect(store.username).toEqual('b');
      expect(store.firstname).toEqual('c');
      expect(store.roles).toEqual(['admin']);
    });

    it('should throw an error if user does not have admin role', async () => {
      setActivePinia(createPinia());

      UserService.findCurrent.mockImplementation(() => Promise.resolve({
        objectId: 'a',
        username: 'b',
        firstname: 'c',
      }));

      RoleService.findByUserId.mockImplementation(() => Promise.resolve([{ name: 'other' }]));
      let error = null;

      try {
        await initUser('userId', 'tempCode');
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
    });
  });
});
