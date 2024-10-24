import * as SecretService from 'src/services/SecretService';
import { vi } from 'vitest';
import { prepareRequest as api, makeFilterRequest } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: SecretService', () => {
  describe('Test function: find', () => {
    it('should return all secrets information', async () => {
      const secrets = [{
        id: 'id_1',
        key: 'test',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: secrets })));

      const data = await SecretService.find({});
      expect(data).toEqual(secrets);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the secret corresponding to the given id', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await SecretService.remove('test');
      expect(mockDeleteRequest).toBeCalledWith('/ai/secrets/test');
    });
  });

  describe('Test function: add', () => {
    it('should create the secret', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve({
        data: {
          id: 'id_1',
          key: 'test',
        },
      }));

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await SecretService.add('key', 'value');
      expect(mockPostRequest).toBeCalledWith('/ai/secrets', { key: 'key', value: 'value' });
    });
  });

  describe('Test function: update', () => {
    it('should update the secret corresponding to the given id', async () => {
      const mockPutRequest = vi.fn(() => Promise.resolve({
        data: {
          id: 'id_1',
          key: 'key',
        },
      }));

      api.mockImplementation(() => ({
        put: mockPutRequest,
      }));

      await SecretService.update('test', 'key', 'value');
      expect(mockPutRequest).toBeCalledWith('/ai/secrets/test', { key: 'key', value: 'value' });
    });
  });
});
