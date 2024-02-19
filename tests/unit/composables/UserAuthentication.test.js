import { initUser } from 'src/composables/UserAuthentication';
import * as UserService from 'src/services/UserService';
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';
import { vi } from 'vitest';

vi.mock('src/services/UserService');
vi.mock('src/services/RoleService');

describe('Test: User Authentication', () => {
  describe('Test function: initUser', () => {
    it('should do nothing if user is already initialized', async () => {
      setActivePinia(createPinia());

      const store = useUserStore();

      store.ready = true;
      UserService.getCurrent.mockImplementation(() => Promise.resolve());

      await initUser();

      expect(UserService.getCurrent).not.toBeCalled();
    });

    it('should initialize user if user has "admin" related permissions but has not been initialized yet', async () => {
      setActivePinia(createPinia());

      const store = useUserStore();

      UserService.getCurrent.mockImplementation(() => Promise.resolve({
        login: 'Login',
        name: 'Name',
        email: 'Email',
      }));

      UserService.getMyPermissions.mockImplementation(() => Promise.resolve([{ action: 'ACCESS', entity: 'ADMIN' }]));

      await initUser();

      expect(store.login).toEqual('Login');
      expect(store.name).toEqual('Name');
      expect(store.email).toEqual('Email');
      expect(store.permissions).toEqual([{ action: 'ACCESS', entity: 'ADMIN' }]);
    });

    it('should throw an error if user does not have the "admin" related permissions', async () => {
      setActivePinia(createPinia());

      UserService.getCurrent.mockImplementation(() => Promise.resolve({
        login: 'Login',
        name: 'Name',
        email: 'Email',
      }));
      UserService.getMyPermissions.mockImplementation(() => Promise.resolve([{ action: 'ACTION', entity: 'DEV' }, { action: 'ACCESS', entity: 'DEV' }]));

      let error = null;

      try {
        await initUser();
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeNull();
    });
  });
});
