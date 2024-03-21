import {
  describe,
  expect,
  it,
} from 'vitest';
import { prepareQueryParameters } from 'src/boot/axios';

describe('Test component: axios', () => {
  describe('Test function: prepareQueryParameters', () => {
    it('Should return empty string', async () => {
      expect('').toEqual(prepareQueryParameters());
      expect('').toEqual(prepareQueryParameters({}));
      expect('').toEqual(prepareQueryParameters({ name: '' }));
    });

    it('Should return valid string', async () => {
      expect('?name=test').toEqual(prepareQueryParameters({ name: 'test' }));
      expect('?name1=test1&name2=test2').toEqual(prepareQueryParameters({ name1: 'test1', name2: 'test2' }));
    });
  });
});
