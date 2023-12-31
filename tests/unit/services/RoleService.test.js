import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: RoleService', () => {
  describe('Test function: find', () => {
    it('should return the roles', async () => {
      const roles = [{
        name: 'CF_createProject',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: roles } }));

      const data = await RoleService.find();
      expect(data).toEqual(roles);
    });
  });

  describe('Test function: findByUserId', () => {
    it('should return the current user roles', async () => {
      const roles = [{
        name: 'admin',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: roles } }));

      const data = await RoleService.findByUserId('r:dead779dcda4970cc7f96c09a328d771');
      expect(data).toEqual([{ name: 'admin' }]);
    });
  });
});
