import { test, expect } from '@jest/globals';
import path from 'path';
import genDiff from '../src/gendiff';

test('genDiff', () => {
  const pwd = process.cwd();
  let currentPath1 = 'fixtures/json/before.json';
  let currentPath2 = 'fixtures/json/after.json';

  let path1 = path.join(pwd, currentPath1);
  let path2 = path.join(pwd, currentPath2);

  const resultFromJson = '  host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true\n';
  expect(genDiff(path1, path2)).toBe(resultFromJson);

  currentPath1 = 'fixtures/yml/before.yml';
  currentPath2 = 'fixtures/yml/after.yml';
  path1 = path.join(pwd, currentPath1);
  path2 = path.join(pwd, currentPath2);

  const resultFromYml = '  format: yml\n- timeout: 100\n+ timeout: 120\n- revision: v1\n+ revision: v2\n+ step: 5\n';
  expect(genDiff(path1, path2)).toBe(resultFromYml);

  currentPath1 = 'fixtures/yml/before.yml';
  currentPath2 = 'fixtures/json/after.json';
  path1 = path.join(pwd, currentPath1);
  path2 = path.join(pwd, currentPath2);

  const resultYmlJson = '- format: yml\n- timeout: 100\n+ timeout: 20\n- revision: v1\n+ verbose: true\n+ host: hexlet.io\n';
  expect(genDiff(path1, path2)).toBe(resultYmlJson);
});
