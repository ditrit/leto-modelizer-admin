import * as GroupService from 'src/services/GroupService';
import { vi } from 'vitest';
import { prepareRequest as api, makeFilterRequest } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: GroupService', () => {
  describe('Test function: find', () => {
    it('should return the groups', async () => {
      const groups = [{
        name: 'groups',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: groups })));

      const data = await GroupService.find({});
      expect(data).toEqual(groups);
    });
  });

  describe('Test function: findById', () => {
    it('should return the group', async () => {
      const group = {
        name: 'group',
        id: 'w2U52H05zx',
      };

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: group }),
      }));

      const res = await GroupService.findById(group.id);
      expect(res).toEqual(group);
    });
  });

  describe('Test function: create', () => {
    it('should call api.post with the groupe name to create', async () => {
      const newGroup = {
        name: 'newGroup',
      };

      const mockPostRequest = vi.fn(() => Promise.resolve({ data: newGroup }));

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await GroupService.create('newGroup');
      expect(mockPostRequest).toBeCalledWith('/groups', newGroup);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the group corresponding to the given id', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await GroupService.remove('test');
      expect(mockDeleteRequest).toBeCalledWith('/groups/test');
    });
  });

  describe('Test function: findByLogin', () => {
    it('should return the current user groups', async () => {
      const groups = [{
        name: 'group',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: groups })));

      const data = await GroupService.findByLogin('login', {});
      expect(data).toEqual([{ name: 'group' }]);
    });
  });

  describe('Test function: findByRoleId', () => {
    it('should return all groups of a role', async () => {
      const groups = [{
        name: 'group',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: groups })));

      const data = await GroupService.findByRoleId('login', {});
      expect(data).toEqual([{ name: 'group' }]);
    });
  });

  describe('Test function: findSubGroups', () => {
    it('should return the group sub groups', async () => {
      const subGroups = [{
        name: 'subGroups',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: subGroups })));

      const data = await GroupService.findSubGroups('groupId', {});
      expect(data).toEqual([{ name: 'subGroups' }]);
    });
  });

  describe('Test function: associateGroupAndUser', () => {
    it('should call api.post with endpoint using "groupId"', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await GroupService.associateGroupAndUser('userLogin', 'groupId');

      expect(mockPostRequest).toBeCalledWith(
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
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await GroupService.dissociateGroupAndUser('userLogin', 'groupId');

      expect(mockDeleteRequest).toBeCalledWith('/groups/groupId/users/userLogin');
    });
  });

  describe('Test function: associateGroupAndGroup', () => {
    it('should call api.post with endpoint using "groupId"', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await GroupService.associateGroupAndGroup('groupId', 'groupIdToAttach');

      expect(mockPostRequest).toBeCalledWith(
        '/groups/groupId/groups',
        'groupIdToAttach',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      );
    });
  });

  describe('Test function: dissociateGroupAndGroup', () => {
    it('should call api.delete with endpoint using "groupId" and "groupIdToDetach"', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await GroupService.dissociateGroupAndGroup('groupId', 'groupIdToDetach');

      expect(mockDeleteRequest).toBeCalledWith('/groups/groupId/groups/groupIdToDetach');
    });
  });
});
