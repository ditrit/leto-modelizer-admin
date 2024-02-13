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

      api.get.mockImplementation(() => Promise.resolve({ data: groups }));

      const data = await GroupService.find();
      expect(data).toEqual(groups);
    });
  });

  describe('Test function: findById', () => {
    it('should return the group', async () => {
      const group = {
        name: 'group',
        id: 'w2U52H05zx',
      };

      api.get.mockImplementation(() => Promise.resolve({ data: group }));

      const res = await GroupService.findById(group.id);
      expect(res).toEqual(group);
    });
  });

  describe('Test function: create', () => {
    it('should call api.post with the groupe name to create', async () => {
      const newGroup = {
        name: 'newGroup',
      };

      api.post.mockImplementation(() => Promise.resolve());

      await GroupService.create('newGroup');
      expect(api.post).toBeCalledWith('/groups', newGroup);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the group corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await GroupService.remove('test');
      expect(api.delete).toBeCalledWith('/groups/test');
    });
  });

  describe('Test function: findByLogin', () => {
    it('should return the current user groups', async () => {
      const groups = [{
        name: 'group',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: groups }));

      const data = await GroupService.findByLogin('login');
      expect(data).toEqual([{ name: 'group' }]);
    });
  });

  describe('Test function: associateGroupAndUser', () => {
    it('should call api.post with endpoint using "groupId"', async () => {
      api.post.mockImplementation(() => Promise.resolve());

      await GroupService.associateGroupAndUser('userLogin', 'groupId');

      expect(api.post).toBeCalledWith(
        '/groups/groupId/users',
        'userLogin',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
    });
  });

  describe('Test function: dissociateGroupAndUser', () => {
    it('should call api.delete with endpoint using "groupId" and "userLogin"', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await GroupService.dissociateGroupAndUser('userLogin', 'groupId');

      expect(api.delete).toBeCalledWith('/groups/groupId/users/userLogin');
    });
  });
});
