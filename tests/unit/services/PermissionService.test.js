import * as PermissionService from 'src/services/PermissionService';
import { vi } from 'vitest';
import {
  prepareRequest as api,
  makeFilterRequest,
  prepareQueryParameters,
} from 'boot/axios';

vi.mock('boot/axios');

describe('Test: PermissionService', () => {
  let permissions;
  let expectedKeys;

  beforeEach(() => {
    permissions = [
      { entity: 'user', action: 'read', libraryId: 123 },
      { entity: 'book', action: 'write', libraryId: null },
      { entity: 'admin', action: 'delete', libraryId: 456 },
    ];

    expectedKeys = [
      {
        entity: 'user', action: 'read', libraryId: 123, key: 'user_read_ID',
      },
      {
        entity: 'book', action: 'write', libraryId: null, key: 'book_write_NULL',
      },
      {
        entity: 'admin', action: 'delete', libraryId: 456, key: 'admin_delete_ID',
      },
    ];

    api.mockImplementation(vi.fn(() => 'api'));
    prepareQueryParameters.mockImplementation(vi.fn(() => ''));
  });

  describe('Test function: generatePermissionKey', () => {
    it('should correctly generate keys', async () => {
      const resultWithLibraryId = PermissionService.generatePermissionKey(permissions[0]);
      const resultWithoutLibraryId = PermissionService.generatePermissionKey(permissions[1]);

      expect(resultWithLibraryId).toEqual(expectedKeys[0].key);
      expect(resultWithoutLibraryId).toEqual(expectedKeys[1].key);
    });
  });

  describe('Test function: find', () => {
    it('should fetch permissions and generate keys', async () => {
      const mockGetRequest = vi.fn(() => Promise.resolve({ data: { content: expectedKeys } }));

      api.mockImplementation(() => ({
        get: mockGetRequest,
      }));

      const result = await PermissionService.find();

      expect(mockGetRequest).toBeCalledWith('/permissions');
      expect(result.content).toEqual(expectedKeys);
    });
  });

  describe('Test function: findByLogin', () => {
    it('should call api.get', async () => {
      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve(
        { data: { content: expectedKeys } },
      )));

      const result = await PermissionService.findByLogin('userLogin', {});

      expect(makeFilterRequest).toBeCalledWith('api', '/users/userLogin/permissions');
      expect(result.content).toEqual(expectedKeys);
    });
  });

  describe('Test function: findByRoleId', () => {
    it('should call api.get with endpoint using "roleId" and return permissions with generated key', async () => {
      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve(
        { data: { content: expectedKeys } },
      )));

      const result = await PermissionService.findByRoleId('roleId', {});

      expect(makeFilterRequest).toBeCalledWith('api', 'roles/roleId/permissions');
      expect(result.content).toEqual(expectedKeys);
    });
  });

  describe('Test function: findByGroupId', () => {
    it('should return the group permissions', async () => {
      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve(
        { data: { content: expectedKeys } },
      )));

      const result = await PermissionService.findByGroupId('groupId', {});

      expect(makeFilterRequest).toBeCalledWith('api', 'groups/groupId/permissions');
      expect(result.content).toEqual(expectedKeys);
    });
  });
});
