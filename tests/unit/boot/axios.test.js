import { manageError } from 'src/boot/axios';
import { expect, it } from 'vitest';

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
});
