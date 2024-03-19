import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';
import { prepareRequest as api } from 'boot/axios';

vi.mock('boot/axios');
vi.mock('src/services/PermissionService');

describe('Test: RoleService', () => {
  describe('Test function: find', () => {
    it('should return the roles and corresponding types', async () => {
      const roles = [
        {
          name: 'Super Administator',
        },
        {
          name: 'Administator',
        },
        {
          name: 'Developer',
        },
      ];

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: roles }),
      }));

      const data = await RoleService.find();
      expect(data).toEqual(roles);
    });
  });

  describe('Test function: findById', () => {
    it('should return role by id', async () => {
      const role = {
        name: 'admin',
      };

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: role }),
      }));

      const data = await RoleService.findById('userLogin');
      expect(data).toEqual({ name: 'admin' });
    });
  });

  describe('Test function: findByLogin', () => {
    it('should return roles of a user', async () => {
      const roles = [{
        name: 'admin',
      }];

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: roles }),
      }));

      const data = await RoleService.findByLogin('userLogin');
      expect(data).toEqual([{ name: 'admin' }]);
    });
  });

  describe('Test function: create', () => {
    it('should call api.post with the role name to create', async () => {
      const newRole = {
        name: 'newRole',
      };

      const mockPostRequest = vi.fn(() => Promise.resolve({ data: newRole }));

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await RoleService.create('newRole');
      expect(mockPostRequest).toBeCalledWith('/roles', newRole);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the role corresponding to the given id', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await RoleService.remove('test');
      expect(mockDeleteRequest).toBeCalledWith('/roles/test');
    });
  });

  describe('Test function: associateRoleAndUser', () => {
    it('should call api.post with endpoint using "roleId"', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await RoleService.associateRoleAndUser('userLogin', 'roleId');

      expect(mockPostRequest).toBeCalledWith(
        '/roles/roleId/users',
        'userLogin',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
    });
  });

  describe('Test function: dissociateRoleAndUser', () => {
    it('should call api.delete with endpoint using "roleId" and "userLogin"', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await RoleService.dissociateRoleAndUser('userLogin', 'roleId');

      expect(mockDeleteRequest).toBeCalledWith('/roles/roleId/users/userLogin');
    });
  });

  describe('Test function: findByGroupId', () => {
    it('should return all roles of a group', async () => {
      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: 'roles' }),
      }));

      const data = await RoleService.findByGroupId();
      expect(data).toEqual('roles');
    });
  });

  describe('Test function: findSubRoles', () => {
    it('should return all sub roles of a role', async () => {
      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: 'roles' }),
      }));

      const data = await RoleService.findSubRoles();
      expect(data).toEqual('roles');
    });
  });

  describe('Test function: associateRoleAndGroup', () => {
    it('should call api.post with endpoint using "roleId"', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await RoleService.associateRoleAndGroup('groupId', 'roleId');

      expect(mockPostRequest).toBeCalledWith(
        '/roles/roleId/groups',
        'groupId',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
    });
  });

  describe('Test function: dissociateRoleAndGroup', () => {
    it('should call api.delete with endpoint using "groupId" and "roleId"', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await RoleService.dissociateRoleAndGroup('groupId', 'roleId');

      expect(mockDeleteRequest).toBeCalledWith('/roles/roleId/groups/groupId');
    });
  });

  describe('Test function: associateRoleAndPermission', () => {
    it('should call api.post with endpoint using "roleId"', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await RoleService.associateRoleAndPermission('roleId', 'permissionId');

      expect(mockPostRequest).toBeCalledWith(
        '/roles/roleId/permissions',
        'permissionId',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
    });
  });

  describe('Test function: dissociateRoleAndPermission', () => {
    it('should call api.delete with endpoint using "permissionId" and "roleId"', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await RoleService.dissociateRoleAndPermission('roleId', 'permissionId');

      expect(mockDeleteRequest).toBeCalledWith('/roles/roleId/permissions/permissionId');
    });
  });

  describe('Test function: associateRoleAndRole', () => {
    it('should call api.post with endpoint using "roleId"', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await RoleService.associateRoleAndRole('roleId', 'roleIdToDetach');

      expect(mockPostRequest).toBeCalledWith(
        '/roles/roleIdToDetach/roles',
        'roleId',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
    });
  });

  describe('Test function: dissociateRoleAndRole', () => {
    it('should call api.delete with endpoint using "roleIdToDetach" and "roleId"', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await RoleService.dissociateRoleAndRole('roleId', 'roleIdToDetach');

      expect(mockDeleteRequest).toBeCalledWith('/roles/roleIdToDetach/roles/roleId');
    });
  });
});
