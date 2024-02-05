import * as UserService from 'src/services/UserService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: UserService', () => {
  describe('Test function: findCurrent', () => {
    it('should return the current user information', async () => {
      const data = {
        objectId: 'Ylof2OIHfi',
        createdAt: '2023-10-25T12:19:09.068Z',
        updatedAt: '2023-10-25T12:19:09.068Z',
        username: 'MySuperUsername',
        authData: {
          github: {
            id: 99999,
            access_token: 'gho_MySuperAccessToken',
          },
        },
        firstname: 'Pradeep',
        ACL: {
          Ylof2OIHfi: {
            read: true,
            write: true,
          },
        },
        sessionToken: 'r:dead779dcda4970cc7f96c09a328d771',
      };

      api.get.mockImplementation(() => Promise.resolve({ data }));

      const user = await UserService.findCurrent('r:dead779dcda4970cc7f96c09a328d771');
      expect(user.sessionToken).toEqual('r:dead779dcda4970cc7f96c09a328d771');
      expect(user.username).toEqual('MySuperUsername');
      expect(user.firstname).toEqual('Pradeep');
    });
  });

  describe('Test function: find', () => {
    it('should return all users information', async () => {
      const users = [{
        firstname: 'firstname',
        username: 'username',
        email: 'email',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: users } }));

      const data = await UserService.find();
      expect(data).toEqual(users);
    });
  });

  describe('Test function: findById', () => {
    it('should return the user', async () => {
      const user = {
        name: 'user',
        objectId: 'w2U52H05zx',
      };

      api.get.mockImplementation(() => Promise.resolve({ data: user }));

      const res = await UserService.findById(user.objectId);
      expect(res).toEqual(user);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the user corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await UserService.remove('test');
      expect(api.delete).toBeCalledWith('/api/Users/test', { headers: undefined });
    });
  });

  describe('Test function: addUserToGroup', () => {
    it('should call api.put with endpoint using "groupId"', async () => {
      api.put.mockImplementation(() => Promise.resolve());

      const userObject = {
        users: {
          __op: 'AddRelation',
          objects: [
            {
              __type: 'Pointer',
              className: '_User',
              objectId: 'userId',
            },
          ],
        },
      };

      await UserService.addUserToGroup('userId', 'groupId');

      expect(api.put).toBeCalledWith('/api/classes/Group/groupId', userObject, { headers: undefined });
    });
  });

  describe('Test function: removeUserFromGroup', () => {
    it('should call api.put with endpoint using "groupId"', async () => {
      api.put.mockImplementation(() => Promise.resolve());

      const userObject = {
        users: {
          __op: 'RemoveRelation',
          objects: [
            {
              __type: 'Pointer',
              className: '_User',
              objectId: 'userId',
            },
          ],
        },
      };

      await UserService.removeUserFromGroup('userId', 'groupId');

      expect(api.put).toBeCalledWith('/api/classes/Group/groupId', userObject, { headers: undefined });
    });
  });

  describe('Test function: findByGroupId', () => {
    it('should return all users of a group', async () => {
      const data = {
        objectId: 'duBFL0HNy',
        createdAt: '2024-02-01T08:50:21.106Z',
        updatedAt: '2024-02-01T08:50:21.106Z',
        username: 'MySuperUsername',
        authData: {
          github: {
            id: 99999,
            access_token: 'gho_MySuperAccessToken',
          },
        },
        firstname: 'Pradeep',
        ACL: {
          duBFL0HNy: {
            read: true,
            write: true,
          },
        },
      };

      api.get.mockImplementation(() => Promise.resolve({ data }));

      await UserService.findByGroupId('groupId');

      expect(api.get).toBeCalledWith(
        '/api/classes/_User',
        {
          headers: undefined,
          params: {
            where: JSON.stringify({ $relatedTo: { object: { __type: 'Pointer', className: 'Group', objectId: 'groupId' }, key: 'users' } }),
          },
        },
      );
    });
  });
});
