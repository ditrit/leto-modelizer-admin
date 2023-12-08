import {
  getUserInformation,
  getUserRoles,
  getLibraries,
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
});
