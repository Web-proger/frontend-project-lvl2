import { test, expect, beforeAll } from '@jest/globals';
import path from 'path';
import genDiff from '../src/gendiff';

let pwd;
let currentPath1;
let currentPath2;
let path1;
let path2;

beforeAll(() => {
  pwd = process.cwd();
});

test('JSON', () => {
  currentPath1 = 'fixtures/json/before.json';
  currentPath2 = 'fixtures/json/after.json';
  path1 = path.join(pwd, currentPath1);
  path2 = path.join(pwd, currentPath2);

  const resultFromJson = '  host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true\n';
  expect(genDiff(path1, path2)).toBe(resultFromJson);
});

test('YML', () => {
  currentPath1 = 'fixtures/yml/before.yml';
  currentPath2 = 'fixtures/yml/after.yml';
  path1 = path.join(pwd, currentPath1);
  path2 = path.join(pwd, currentPath2);

  const resultFromYml = '  format: yml\n- timeout: 100\n+ timeout: 120\n- revision: v1\n+ revision: v2\n+ step: 5\n';
  expect(genDiff(path1, path2)).toBe(resultFromYml);
});

test('INI', () => {
  currentPath1 = 'fixtures/ini/before.ini';
  currentPath2 = 'fixtures/ini/after.ini';
  path1 = path.join(pwd, currentPath1);
  path2 = path.join(pwd, currentPath2);

  const resultFromIni = '  car: lexus\n- model: r300\n+ model: r330\n  year: 2004\n- engine: 3.0\n+ engine: 3.3\n- mileage: 167000\n+ mileage: 235000\n';
  expect(genDiff(path1, path2)).toBe(resultFromIni);
});

test('YML - JSON', () => {
  currentPath1 = 'fixtures/yml/before.yml';
  currentPath2 = 'fixtures/json/after.json';
  path1 = path.join(pwd, currentPath1);
  path2 = path.join(pwd, currentPath2);

  const resultYmlJson = '- format: yml\n- timeout: 100\n+ timeout: 20\n- revision: v1\n+ verbose: true\n+ host: hexlet.io\n';
  expect(genDiff(path1, path2)).toBe(resultYmlJson);
});
