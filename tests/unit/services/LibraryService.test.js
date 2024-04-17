import * as LibraryService from 'src/services/LibraryService';
import { vi } from 'vitest';
import { prepareRequest as api, makeFilterRequest } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: LibraryService', () => {
  describe('Test function: findById', () => {
    it('should return the library', async () => {
      const library = {
        insertDate: '2024-02-13T09:02 :05.789+00:00',
        updateDate: '2024-02-13T09:02 :05.789+00:00',
        id: 1,
        url: 'http://localhost:8000/valid/simple/',
        documentationUrl: null,
        name: 'Simple library',
        version: '0.1.0',
        maintainer: 'Zorin95670',
        description: 'Library with all templates types.',
      };

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: library }),
      }));

      const res = await LibraryService.findById(library.id);
      expect(res).toEqual(library);
    });
  });

  describe('Test function: find', () => {
    it('should return the libraries', async () => {
      const libraries = [{
        insertDate: '2024-02-13T09:02 :05.789+00:00',
        updateDate: '2024-02-13T09:02 :05.789+00:00',
        id: 1,
        url: 'http://localhost:8000/valid/simple/',
        documentationUrl: null,
        name: 'Simple library',
        version: '0.1.0',
        maintainer: 'Zorin95670',
        description: 'Library with all templates types.',
      }];

      makeFilterRequest.mockImplementation(vi.fn(() => Promise.resolve({ data: libraries })));

      const data = await LibraryService.find({});
      expect(data).toEqual(libraries);
    });
  });

  describe('Test function: findTemplates', () => {
    it('should return the templates of library', async () => {
      const templates = [{
        insertDate: '2024-03-19T13:08:35.111+00:00',
        updateDate: '2024-03-19T13:08:35.111+00:00',
        id: '2b4ea8b2-e0b4-4a1f-919d-c441fcf30ce5',
        libraryId: '88aa76fa-9b7b-4e28-9181-e0354984d859',
        documentationUrl: 'doc url',
        name: 'Template of diagram',
        type: 'DIAGRAM',
        description: 'Diagram template example.',
        basePath: '.github/workflows/',
        plugins: ['githubator-plugin'],
        icon: 'diagram.svg',
        schemas: ['schema.svg'],
        files: ['CI.yml'],
      }];

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: templates }),
      }));

      const data = await LibraryService.findTemplates('id');
      expect(data).toEqual(templates);
    });
  });

  describe('Test function: remove', () => {
    it('should remove the library corresponding to the given id', async () => {
      const mockDeleteRequest = vi.fn(() => Promise.resolve());

      api.mockImplementation(() => ({
        delete: mockDeleteRequest,
      }));

      await LibraryService.remove('test');
      expect(mockDeleteRequest).toBeCalledWith('/libraries/test');
    });
  });

  describe('Test function: create', () => {
    it('should create the corresponding library', async () => {
      const mockPostRequest = vi.fn(() => Promise.resolve({ data: { id: 1 } }));

      api.mockImplementation(() => ({
        post: mockPostRequest,
      }));

      const result = await LibraryService.create('url', 'role');

      expect(mockPostRequest).toBeCalledWith('/libraries', { url: 'url', role: 'role' });
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('Test function: synchronize', () => {
    it('should synchronize the corresponding library', async () => {
      const mockPutRequest = vi.fn(() => Promise.resolve({ data: { id: 1 } }));

      api.mockImplementation(() => ({
        put: mockPutRequest,
      }));

      const result = await LibraryService.synchronize('id', 'url');

      expect(mockPutRequest).toBeCalledWith('/libraries/id', { url: 'url' });
      expect(result).toEqual({ id: 1 });
    });
  });
});
