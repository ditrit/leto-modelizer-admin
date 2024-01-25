import * as GroupService from 'src/services/GroupService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: GroupService', () => {
  describe('Test function: find', () => {
    it('should return the groups', async () => {
      const groups = [{
        name: 'groups',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: groups } }));

      const data = await GroupService.find();
      expect(data).toEqual(groups);
    });
  });

  describe('Test function: findById', () => {
    it('should return the group', async () => {
      const group = {
        name: 'group',
        objectId: 'w2U52H05zx',
      };

      api.get.mockImplementation(() => Promise.resolve({ data: group }));

      const res = await GroupService.findById(group.objectId);
      expect(res).toEqual(group);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the group corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await GroupService.remove('test');
      expect(api.delete).toBeCalledWith('/api/classes/Group/test', { headers: undefined });
    });
  });

  describe('Test function: findByUserId', () => {
    it('should return the current user groups', async () => {
      const groups = [{
        name: 'group',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: groups } }));

      const data = await GroupService.findByUserId('r:ded779dcda4970cc7f96c09a328d771');
      expect(data).toEqual([{ name: 'group' }]);
    });
  });
});
