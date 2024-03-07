import * as UserService from 'src/services/UserService';
import { vi } from 'vitest';
import { prepareRequest as api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: UserService', () => {
  describe('Test function: getCurrent', () => {
    it('should return the current user information', async () => {
      const data = {
        login: 'Login',
        name: 'name',
        email: 'Email',
      };

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data }),
      }));

      const user = await UserService.getCurrent();
      expect(user.login).toEqual('Login');
      expect(user.name).toEqual('name');
      expect(user.email).toEqual('Email');
    });
  });

  describe('Test function: getMyPermissions', () => {
    it('should call api.get', async () => {
      const mockGetRequest = vi.fn(() => Promise.resolve({ data: 'permissions' }));

      api.mockImplementation(() => ({
        get: mockGetRequest,
      }));

      await UserService.getMyPermissions();

      expect(mockGetRequest).toBeCalledWith('/users/me/permissions');
    });
  });

  describe('Test function: find', () => {
    it('should return all users information', async () => {
      const users = [{
        firstname: 'firstname',
        username: 'username',
        email: 'email',
      }];

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: users }),
      }));

      const data = await UserService.find();
      expect(data).toEqual(users);
    });
  });

  describe('Test function: findByLogin', () => {
    it('should return the user', async () => {
      const user = {
        name: 'user',
        login: 'login',
      };

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: user }),
      }));

      const res = await UserService.findByLogin(user.login);
      expect(res).toEqual(user);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the user corresponding to the given id', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await UserService.remove('test');
      expect(mockDeleteRequest).toBeCalledWith('/users/test');
    });
  });

  describe('Test function: findByGroupId', () => {
    it('should return all users of a group', async () => {
      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: 'users' }),
      }));

      const data = await UserService.findByGroupId();
      expect(data).toEqual('users');
    });
  });
});
