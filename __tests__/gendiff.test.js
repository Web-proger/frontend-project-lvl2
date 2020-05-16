import { test, expect, beforeAll } from '@jest/globals';
import path from 'path';
import genDiff from '../src/gendiff';

let pwd;
let before;
let after;

const getPath = (currentPath) => path.join(pwd, currentPath);

beforeAll(() => {
  pwd = process.cwd();
});

test('JSON', () => {
  before = 'fixtures/json/before.json';
  after = 'fixtures/json/after.json';

  const resultFromJson = '  host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true\n';
  expect(genDiff(getPath(before), getPath(after))).toBe(resultFromJson);
});

test('YML', () => {
  before = 'fixtures/yml/before.yml';
  after = 'fixtures/yml/after.yml';

  const resultFromYml = '  format: yml\n- timeout: 100\n+ timeout: 120\n- revision: v1\n+ revision: v2\n+ step: 5\n';
  expect(genDiff(getPath(before), getPath(after))).toBe(resultFromYml);
});

test('INI', () => {
  before = 'fixtures/ini/before.ini';
  after = 'fixtures/ini/after.ini';

  const resultFromIni = '  car: lexus\n- model: r300\n+ model: r330\n  year: 2004\n- engine: 3.0\n+ engine: 3.3\n- mileage: 167000\n+ mileage: 235000\n';
  expect(genDiff(getPath(before), getPath(after))).toBe(resultFromIni);
});

test('YML - JSON', () => {
  before = 'fixtures/yml/before.yml';
  after = 'fixtures/json/after.json';

  const resultYmlJson = '- format: yml\n- timeout: 100\n+ timeout: 20\n- revision: v1\n+ verbose: true\n+ host: hexlet.io\n';
  expect(genDiff(getPath(before), getPath(after))).toBe(resultYmlJson);
});
