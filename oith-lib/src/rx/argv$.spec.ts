import { argv$ } from './argv$';
import { expandOffsets$ } from '../offsets/expandOffsets';

test('asdfsdf', async () => {
  // expect(3).toBe(3);
  expect(await argv$({ i: 'test' }, 'i').toPromise()).toBe('test');
  expect(await argv$({ i: true }, 'i').toPromise()).toBe(true);
});
