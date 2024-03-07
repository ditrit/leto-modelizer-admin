import * as ImageDownloadService from 'src/services/ImageDownloadService';
import { vi } from 'vitest';
import { prepareRequest as api } from 'boot/axios';

vi.mock('boot/axios');

describe('Test: ImageDownloadService', () => {
  describe('Test function: downloadImage', () => {
    it('should return the image', async () => {
      const mockImage = 'data:image/png;base64,';

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: 'picture', headers: { 'content-type': 'image/png' } }),
      }));

      const image = await ImageDownloadService.downloadImage('url');
      expect(image).toEqual(mockImage);
    });
  });

  describe('Test function: getUserPicture', () => {
    it('should return the user picture', async () => {
      const mockUserPicture = 'data:image/png;base64,';

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: 'picture', headers: { 'content-type': 'image/png' } }),
      }));

      const userPicture = await ImageDownloadService.getUserPicture('login');
      expect(userPicture).toEqual(mockUserPicture);
    });
  });

  describe('Test function: getLibraryIcon', () => {
    it('should return the library icon', async () => {
      const mockLibraryIcon = 'data:image/png;base64,';

      api.mockImplementation(() => ({
        get: () => Promise.resolve({ data: 'picture', headers: { 'content-type': 'image/png' } }),
      }));

      const libraryIcon = await ImageDownloadService.getLibraryIcon('id');
      expect(libraryIcon).toEqual(mockLibraryIcon);
    });
  });
});
