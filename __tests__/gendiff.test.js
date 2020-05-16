import { test, expect, describe } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';

const pwd = process.cwd();
const getPath = (currentPath) => path.join(pwd, currentPath);
const getResult = (resultPath) => fs.readFileSync(resultPath, 'utf-8');

describe.each([
  ['JSON', 'fixtures/json/before.json', 'fixtures/json/after.json', 'fixtures/json/resultJsonDiff'],
  ['YML', 'fixtures/yml/before.yml', 'fixtures/yml/after.yml', 'fixtures/yml/resultYmlDiff'],
  ['INI', 'fixtures/ini/before.ini', 'fixtures/ini/after.ini', 'fixtures/ini/resultIniDiff'],
  ['JSON', 'fixtures/json/treeBefore.json', 'fixtures/json/treeAfter.json', 'fixtures/json/treeJsonDiff'],
])('config diff', (name, before, after, result) => {
  test(name, () => {
    expect(genDiff(getPath(before), getPath(after))).toBe(getResult(getPath(result)));
  });
});
