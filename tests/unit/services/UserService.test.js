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
});
