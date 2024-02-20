import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

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

      api.get.mockImplementation(() => Promise.resolve({ data: roles }));

      const data = await RoleService.find();
      expect(data).toEqual(roles);
    });
  });

  describe('Test function: findByLogin', () => {
    it('should roles of a user', async () => {
      const roles = [{
        name: 'admin',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: roles }));

      const data = await RoleService.findByLogin('userLogin');
      expect(data).toEqual([{ name: 'admin' }]);
    });
  });

  describe('Test function: create', () => {
    it('should call api.post with the role name to create', async () => {
      const newRole = {
        name: 'newRole',
      };

      api.post.mockImplementation(() => Promise.resolve({ data: newRole }));

      await RoleService.create('newRole');
      expect(api.post).toBeCalledWith('/roles', newRole);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the role corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await RoleService.remove('test');
      expect(api.delete).toBeCalledWith('/roles/test');
    });
  });

  describe('Test function: associateRoleAndUser', () => {
    it('should call api.post with endpoint using "roleId"', async () => {
      api.post.mockImplementation(() => Promise.resolve());

      await RoleService.associateRoleAndUser('userLogin', 'roleId');

      expect(api.post).toBeCalledWith(
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
      api.delete.mockImplementation(() => Promise.resolve());

      await RoleService.dissociateRoleAndUser('userLogin', 'roleId');

      expect(api.delete).toBeCalledWith('/roles/roleId/users/userLogin');
    });
  });
});
