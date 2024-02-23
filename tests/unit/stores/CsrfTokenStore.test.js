import { setActivePinia, createPinia } from 'pinia';
import { useCsrfStore } from 'src/stores/CsrfTokenStore';

describe('Csrf Store', () => {
  let store = null;
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to: `useStore(pinia)`
    setActivePinia(createPinia());
    store = useCsrfStore();
  });

  describe('Test store variable: headerName', () => {
    it('should be initialized to an empty string', () => {
      expect(store.headerName).toEqual('');
    });

    it('should return the new value after being set', () => {
      store.headerName = 'headerName';

      expect(store.headerName).toEqual('headerName');
    });
  });

  describe('Test store variable: token', () => {
    it('should be initialized to an empty string', () => {
      expect(store.token).toEqual('');
    });

    it('should return the new value after being set', () => {
      store.token = 'token';

      expect(store.token).toEqual('token');
    });
  });

  describe('Test store variable: expirationDate', () => {
    it('should be initialized to zero', () => {
      expect(store.expirationDate).toEqual(0);
    });

    it('should return the new value after being set', () => {
      store.expirationDate = 1234;

      expect(store.expirationDate).toEqual(1234);
    });
  });
});
