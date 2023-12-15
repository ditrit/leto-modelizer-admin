import * as UserGroupService from 'src/services/UserGroupService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: UserGroupService', () => {
  describe('Test function: find', () => {
    it('should return the userGroups', async () => {
      const userGroups = [{
        name: 'userGroups',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: userGroups } }));

      const data = await UserGroupService.find();
      expect(data).toEqual(userGroups);
    });
  });
});
