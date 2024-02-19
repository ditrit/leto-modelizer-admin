import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from 'src/stores/UserStore';

describe('User Store', () => {
  let store = null;
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to: `useStore(pinia)`
    setActivePinia(createPinia());
    store = useUserStore();
  });

  describe('Test store variable: login', () => {
    it('should be initialized to an empty string', () => {
      expect(store.login).toEqual('');
    });

    it('should return the new value after being set', () => {
      store.login = 'login';

      expect(store.login).toEqual('login');
    });
  });

  describe('Test store variable: name', () => {
    it('should be initialized to an empty string', () => {
      expect(store.name).toEqual('');
    });

    it('should return the new value after being set', () => {
      store.name = 'name';

      expect(store.name).toEqual('name');
    });
  });

  describe('Test store variable: email', () => {
    it('should be initialized to an empty string', () => {
      expect(store.email).toEqual('');
    });

    it('should return the new value after being set', () => {
      store.email = 'email';

      expect(store.email).toEqual('email');
    });
  });

  describe('Test store variable: permissions', () => {
    it('should be initialized to an empty string', () => {
      expect(store.permissions).toEqual([]);
    });

    it('should return the new value after being set', () => {
      store.permissions = ['admin'];

      expect(store.permissions).toEqual(['admin']);
    });
  });

  describe('Test store actions: isAdmin', () => {
    it('should return true if permissions contain "ACCESS_action" and "ADMIN_entity"', () => {
      store.permissions = [{ action: 'ACCESS', entity: 'ADMIN' }];
      expect(store.isAdmin).toBeTruthy();
    });

    it('should return false if permissions don/t contain "ACCESS_action"', () => {
      store.permissions = [{ action: 'ACTION', entity: 'ADMIN' }];
      expect(store.isAdmin).toBeFalsy();
    });

    it('should return false if permissions don/t contain "ADMIN_entity"', () => {
      store.permissions = [{ action: 'ACCESS', entity: 'ENTITY' }];
      expect(store.isAdmin).toBeFalsy();
    });
  });
});
