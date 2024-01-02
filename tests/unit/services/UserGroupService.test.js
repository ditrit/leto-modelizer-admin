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

  describe('Test function: findById', () => {
    it('should return the userGroup', async () => {
      const userGroup = {
        name: 'userGroup',
        objectId: 'w2U52H05zx',
      };

      api.get.mockImplementation(() => Promise.resolve({ data: userGroup }));

      const res = await UserGroupService.findById(userGroup.objectId);
      expect(res).toEqual(userGroup);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the userGroup corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await UserGroupService.remove('test');
      expect(api.delete).toBeCalledWith('/api/classes/Group/test', { headers: undefined });
    });
  });
});
