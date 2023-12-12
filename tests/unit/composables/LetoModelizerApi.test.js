import {
  getUserInformation,
  getUserRoles,
  getLibraries,
  getRoles,
  getLibraryById,
  manageError,
} from 'src/composables/LetoModelizerApi';
import { vi } from 'vitest';

vi.mock('boot/axios');

describe('User Authentication', () => {
  describe('Test function: getUserInformation', () => {
    it('should return the current user information', async () => {
      const resultPostUser = {
        objectId: 'Ylof2OIHfi',
        createdAt: '2023-10-25T12:19:09.068Z',
        updatedAt: '2023-10-25T12:19:09.068Z',
        username: 'MySuperUsername',
        authData: {
          github: {
            id: 99999,
            access_token: 'gho_MySuperAccessToken',
          },
        },
        firstname: 'Pradeep',
        ACL: {
          Ylof2OIHfi: {
            read: true,
            write: true,
          },
        },
        sessionToken: 'r:dead779dcda4970cc7f96c09a328d771',
      };

      const { api } = await import('boot/axios');
      api.get.mockImplementation(() => Promise.resolve(resultPostUser));

      const res = await getUserInformation('r:dead779dcda4970cc7f96c09a328d771');
      expect(res.sessionToken).toEqual('r:dead779dcda4970cc7f96c09a328d771');
      expect(res.username).toEqual('MySuperUsername');
      expect(res.firstname).toEqual('Pradeep');
    });
  });

  describe('Test function: getUserRoles', () => {
    it('should return the current user roles', async () => {
      const resultPostUserRoles = {
        results: [{
          name: 'admin',
        }],
      };

      const { api } = await import('boot/axios');
      api.get.mockImplementation(() => Promise.resolve(resultPostUserRoles));

      const res = await getUserRoles('r:dead779dcda4970cc7f96c09a328d771');
      expect(res.results).toEqual([{ name: 'admin' }]);
    });
  });

  describe('Test function: getLibraries', () => {
    it('should return the libraries', async () => {
      const libraries = [{
        author: 'Vincent Moittie <moittie.vincent@gmail.com>',
        createdAt: '2023-12-04T15:22:15.841Z',
        description: 'Library that contains all default templates for leto-modelizer.',
        name: 'Leto-modelizer-templates-library',
        objectId: 'w2U52H05zx',
        roleName: 'test',
        updatedAt: '2023-12-04T15:22:15.841Z',
        url: 'https://raw.githubusercontent.com/ditrit/leto-modelizer-templates-library/leto-modelizer/e2e_test/index.json',
        version: '0.1.0',
      }];
      const resultGetLibraries = {
        results: libraries,
      };

      const { api } = await import('boot/axios');
      api.get.mockImplementation(() => Promise.resolve(resultGetLibraries));

      const res = await getLibraries();
      expect(res.results).toEqual(libraries);
    });
  });

  describe('Test function: getRoles', () => {
    it('should return the roles', async () => {
      const roles = [{
        name: 'CF_createProject',
      }];
      const resultGetRoles = {
        results: roles,
      };

      const { api } = await import('boot/axios');
      api.get.mockImplementation(() => Promise.resolve(resultGetRoles));

      const res = await getRoles();
      expect(res.results).toEqual(roles);
    });
  });

  describe('Test function: getLibraryById', () => {
    it('should return the library', async () => {
      const library = {
        author: 'Vincent Moittie <moittie.vincent@gmail.com>',
        createdAt: '2023-12-04T15:22:15.841Z',
        description: 'Library that contains all default templates for leto-modelizer.',
        name: 'Leto-modelizer-templates-library',
        objectId: 'w2U52H05zx',
        roleName: 'test',
        updatedAt: '2023-12-04T15:22:15.841Z',
        url: 'https://raw.githubusercontent.com/ditrit/leto-modelizer-templates-library/leto-modelizer/e2e_test/index.json',
        version: '0.1.0',
      };

      const { api } = await import('boot/axios');
      api.get.mockImplementation(() => Promise.resolve({ data: library }));

      const res = await getLibraryById(library.objectId);
      expect(res).toEqual(library);
    });
  });

  describe('Test function: manageError', () => {
    it('should throw an error if status is not 503', async () => {
      let error = null;
      try {
        manageError({ response: { status: 504 } });
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
    });

    it('should not throw an error if status is 503', async () => {
      let error = null;
      try {
        manageError({ response: { status: 503 } });
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
    });
  });
});
