import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';

const getAbsPath = (fileName) => path.join(process.cwd(), '__fixtures__', fileName);
const getResult = (fileName) => {
  const absPath = getAbsPath(fileName);
  return fs.readFileSync(absPath, 'utf-8').trim();
};

describe.each([
  ['JSON', 'before.json', 'after.json', 'diffStylish'],
  ['YML', 'before.yml', 'after.yml', 'diffStylish'],
  ['INI', 'before.ini', 'after.ini', 'diffStylish'],
])('Stylish', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getAbsPath(before);
    const afterData = getAbsPath(after);
    const diff = genDiff(beforeData, afterData);
    const resultData = getResult(result);
    expect(diff).toBe(resultData);
  });
});

describe.each([
  ['Plain', 'before.json', 'after.json', 'diffPlain'],
])('Plain', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getAbsPath(before);
    const afterData = getAbsPath(after);
    const diff = genDiff(beforeData, afterData, 'plain');
    const resultData = getResult(result);
    expect(diff).toBe(resultData);
  });
});

describe.each([
  ['JSON', 'before.json', 'after.json', 'diffJson'],
])('json', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getAbsPath(before);
    const afterData = getAbsPath(after);
    const diff = genDiff(beforeData, afterData, 'json');
    const resultData = getResult(result);
    expect(diff).toBe(resultData);
  });
});
