import * as UserService from 'src/services/UserService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: UserService', () => {
  describe('Test function: getCurrent', () => {
    it('should return the current user information', async () => {
      const data = {
        login: 'Login',
        name: 'name',
        email: 'Email',
      };

      api.get.mockImplementation(() => Promise.resolve({ data }));

      const user = await UserService.getCurrent();
      expect(user.login).toEqual('Login');
      expect(user.name).toEqual('name');
      expect(user.email).toEqual('Email');
    });
  });

  describe('Test function: getMyPicture', () => {
    it('should return the current user picture', async () => {
      const mockUserPicture = 'data:image/png;base64,';

      api.get.mockImplementation(() => Promise.resolve({ data: 'picture', headers: { 'content-type': 'image/png' } }));

      const userPicture = await UserService.getMyPicture();
      expect(userPicture).toEqual(mockUserPicture);
    });
  });

  describe('Test function: getMyPermissions', () => {
    it('should call api.get', async () => {
      api.get.mockImplementation(() => Promise.resolve({ data: 'permissions' }));

      await UserService.getMyPermissions();

      expect(api.get).toBeCalledWith('/users/me/permissions');
    });
  });

  describe('Test function: find', () => {
    it('should return all users information', async () => {
      const users = [{
        firstname: 'firstname',
        username: 'username',
        email: 'email',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: users }));

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

      api.get.mockImplementation(() => Promise.resolve({ data: user }));

      const res = await UserService.findByLogin(user.login);
      expect(res).toEqual(user);
    });
  });

  describe('Test function: getPictureByLogin', () => {
    it('should return a user picture using its login', async () => {
      const mockUserPicture = 'data:image/png;base64,';

      api.get.mockImplementation(() => Promise.resolve({ data: 'picture', headers: { 'content-type': 'image/png' } }));

      const userPicture = await UserService.getPictureByLogin('userLogin');
      expect(userPicture).toEqual(mockUserPicture);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the user corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await UserService.remove('test');
      expect(api.delete).toBeCalledWith('/users/test');
    });
  });

  describe('Test function: findByGroupId', () => {
    it('should return all users of a group', async () => {
      api.get.mockImplementation(() => Promise.resolve({ data: 'users' }));

      const data = await UserService.findByGroupId();
      expect(data).toEqual('users');
    });
  });
});
