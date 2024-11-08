import * as ConfigurationService from 'src/services/ConfigurationService';
import { vi } from 'vitest';
import {
  prepareRequest as api,
  makeFilterRequest,
  prepareQueryParameters,
} from 'boot/axios';

vi.mock('boot/axios');

describe('Test: ConfigurationService', () => {
  describe('Test function: find', () => {
    it('should return all configurations information', async () => {
      const configurations = [{
        id: 'id_1',
        key: 'test',
        value: 'value',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: configurations })));

      const data = await ConfigurationService.find({});
      expect(data).toEqual(configurations);
    });
  });

  describe('Test function: findAll', () => {
    it('should return all configurations information', async () => {
      prepareQueryParameters.mockImplementation((filters) => {
        if (filters?.page === '1') {
          return '&page=2';
        }
        return '';
      });
      makeFilterRequest.mockImplementation((test, url) => {
        if (url === '/ai/configurations') {
          return Promise.resolve({
            data: {
              pageable: {
                pageNumber: 0,
              },
              totalPages: 2,
              content: [{
                id: 'id_1',
                key: 'test',
                value: 'value',
              }],
            },
          });
        }
        return Promise.resolve({
          data: {
            pageable: {
              pageNumber: 2,
            },
            totalPages: 2,
            content: [{
              id: 'id_2',
              key: 'test',
              value: 'value',
            }],
          },
        });
      });

      const data = await ConfigurationService.findAll();
      expect(data).toEqual([{
        id: 'id_1',
        key: 'test',
        value: 'value',
      }, {
        id: 'id_2',
        key: 'test',
        value: 'value',
      }]);
    });
  });

  describe('Test function: findDescriptionFields', () => {
    it('should return all descriptions', async () => {
      const mockGetRequest = vi.fn(() => Promise.resolve({
        data: [],
      }));

      api.mockImplementation(() => ({
        get: mockGetRequest,
      }));

      const result = await ConfigurationService.findDescriptionFields();

      expect(result).toEqual([]);
      expect(mockGetRequest).toBeCalledWith('/ai/proxy/descriptions');
    });
  });

  describe('Test function: add', () => {
    it('should create configuration', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve({
        data: {
          id: 'id_1',
          key: 'test',
          value: 'value',
        },
      }));

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      await ConfigurationService.add({ key: 'test', value: 'value' });

      expect(mockPostRequest).toBeCalledWith('/ai/configurations', { key: 'test', value: 'value' });
    });
  });

  describe('Test function: deleteById', () => {
    it('should delete configuration by id', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve({
        data: {},
      }));

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await ConfigurationService.deleteById('id');

      expect(mockDeleteRequest).toBeCalledWith('/ai/configurations/id');
    });
  });

  describe('Test function: updateAll', () => {
    it('should update all configurations', async () => {
      const mockUpdateRequest = vi.fn(() => Promise.resolve({
        data: {},
      }));

      api.mockImplementation(() => ({
        put: mockUpdateRequest,
      }));

      await ConfigurationService.updateAll([]);

      expect(mockUpdateRequest).toBeCalledWith('/ai/configurations', []);
    });
  });
});
