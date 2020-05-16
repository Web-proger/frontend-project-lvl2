import { test, expect, describe } from '@jest/globals';
import path from 'path';
import genDiff from '../src/gendiff';

const pwd = process.cwd();;
const getPath = (currentPath) => path.join(pwd, currentPath);

describe.each([
  ['JSON', 'fixtures/json/before.json', 'fixtures/json/after.json', '  host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true\n'],
  ['YML', 'fixtures/yml/before.yml', 'fixtures/yml/after.yml', '  format: yml\n- timeout: 100\n+ timeout: 120\n- revision: v1\n+ revision: v2\n+ step: 5\n'],
  ['INI', 'fixtures/ini/before.ini', 'fixtures/ini/after.ini', '  car: lexus\n- model: r300\n+ model: r330\n  year: 2004\n- engine: 3.0\n+ engine: 3.3\n- mileage: 167000\n+ mileage: 235000\n'],
  ['YML-JSON', 'fixtures/yml/before.yml', 'fixtures/json/after.json', '- format: yml\n- timeout: 100\n+ timeout: 20\n- revision: v1\n+ verbose: true\n+ host: hexlet.io\n'],
])('config diff', (name, before, after, result) => {
  test(name, () => {
    expect(genDiff(getPath(before), getPath(after))).toBe(result);
  });
});
