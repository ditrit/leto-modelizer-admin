import {
  getDefaultHeaders,
  manageError,
} from 'src/boot/axios';
import { expect, it } from 'vitest';
import { getUserSessionToken } from 'src/composables/UserAuthentication';

describe('Test: axios', () => {
  describe('Test function: manageError', () => {
    it('should throw an error if status is not 503', async () => {
      let error = null;
      try {
        manageError({ response: { status: 504 } });
      } catch (e) {
        error = e;
      }
      expect(error).not.toBeNull();
    });

    it('should not throw an error if status is 503', async () => {
      let error = null;
      try {
        manageError({ response: { status: 503 } });
      } catch (e) {
        error = e;
      }
      expect(error).toBeNull();
    });
  });

  describe('Test function: getDefaultHeaders', () => {
    it('should return default headers with session token', () => {
      let sessionToken = getUserSessionToken();
      expect(getDefaultHeaders()).toEqual({
        Accept: 'application/json',
        'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
        'X-Parse-Session-Token': sessionToken,
      });

      sessionToken = 'test';
      expect(getDefaultHeaders(sessionToken)).toEqual({
        Accept: 'application/json',
        'X-Parse-Application-Id': process.env.BACKEND_APP_ID,
        'X-Parse-Session-Token': sessionToken,
      });
    });
  });
});
