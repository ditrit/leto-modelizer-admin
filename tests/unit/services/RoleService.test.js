import * as RoleService from 'src/services/RoleService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: RoleService', () => {
  describe('Test function: find', () => {
    it('should return the roles and corresponding types', async () => {
      const roles = [
        {
          name: 'lib_',
        },
        {
          name: 'CF_',
        },
        {
          name: 'admin',
        },
        {
          name: '',
        },
      ];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: roles } }));

      const data = await RoleService.find();
      expect(data).toEqual([
        {
          name: 'lib_',
          type: 'Library',
        },
        {
          name: 'CF_',
          type: 'System',
        },
        {
          name: 'admin',
          type: 'System',
        },
        {
          name: '',
          type: 'Functional',
        },
      ]);
    });
  });

  describe('Test function: findByUserId', () => {
    it('should return the current user roles', async () => {
      const roles = [{
        name: 'admin',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: roles } }));

      const data = await RoleService.findByUserId('r:dead779dcda4970cc7f96c09a328d771');
      expect(data).toEqual([{ name: 'admin', type: 'System' }]);
    });
  });
});
