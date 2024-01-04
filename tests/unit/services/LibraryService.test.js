import * as LibraryService from 'src/services/LibraryService';
import { vi } from 'vitest';
import { api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: LibraryService', () => {
  describe('Test function: findById', () => {
    it('should return the library', async () => {
      const library = {
        author: 'Vincent Moittie <moittie.vincent@gmail.com>',
        createdAt: '2023-12-04T15:22:15.841Z',
        description: 'Library that contains all default templates for leto-modelizer.',
        name: 'Leto-modelizer-templates-library',
        objectId: 'w2U52H05zx',
        roleName: 'test',
        updatedAt: '2023-12-04T15:22:15.841Z',
        url: 'https://raw.githubusercontent.com/ditrit/leto-modelizer-templates-library/leto-modelizer/e2e_test/index.json',
        version: '0.1.0',
      };

      api.get.mockImplementation(() => Promise.resolve({ data: library }));

      const res = await LibraryService.findById(library.objectId);
      expect(res).toEqual(library);
    });
  });

  describe('Test function: find', () => {
    it('should return the libraries', async () => {
      const libraries = [{
        author: 'Vincent Moittie <moittie.vincent@gmail.com>',
        createdAt: '2023-12-04T15:22:15.841Z',
        description: 'Library that contains all default templates for leto-modelizer.',
        name: 'Leto-modelizer-templates-library',
        objectId: 'w2U52H05zx',
        roleName: 'test',
        updatedAt: '2023-12-04T15:22:15.841Z',
        url: 'https://raw.githubusercontent.com/ditrit/leto-modelizer-templates-library/leto-modelizer/e2e_test/index.json',
        version: '0.1.0',
      }];

      api.get.mockImplementation(() => Promise.resolve({ data: { results: libraries } }));

      const data = await LibraryService.find();
      expect(data).toEqual(libraries);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the library corresponding to the given id', async () => {
      api.delete.mockImplementation(() => Promise.resolve());

      await LibraryService.remove('test');
      expect(api.delete).toBeCalledWith('/api/classes/Library/test', { headers: undefined });
    });
  });

  describe('Test function: create', () => {
    it('should create the corresponding library', async () => {
      api.post.mockImplementation(() => Promise.resolve({
        data: { objectId: 1 },
      }));

      const result = await LibraryService.create('url', 'role');

      expect(api.post).toBeCalledWith('/api/classes/Library', { url: 'url', roleName: 'role' }, { headers: undefined });
      expect(result).toEqual({ objectId: 1 });
    });
  });

  describe('Test function: synchronize', () => {
    it('should synchronize the corresponding library', async () => {
      api.put.mockImplementation(() => Promise.resolve({
        data: { objectId: 1 },
      }));

      const result = await LibraryService.synchronize('id', 'url');

      expect(api.put).toBeCalledWith('/api/classes/Library/id', { url: 'url' }, { headers: undefined });
      expect(result).toEqual({ objectId: 1 });
    });
  });
});
