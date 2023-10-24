import { describe, expect, test } from '@jest/globals';
import { sum } from './sum';

describe('[SAMPLE] [Sum] Test', () => {
  test('adds 1 + 2 to equal 3', async () => {
    const response = await sum(1, 2);
    expect(response).toBe(3);
  });
});
