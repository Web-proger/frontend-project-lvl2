import { test, expect, describe } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';
import parsers from '../src/parsers';

// TODO вынести в отдельный модуль, тестирование parser
// TODO Сделать общиай тест, где будут всё модули за раз
const getResult = (resultPath) => fs.readFileSync(resultPath, 'utf-8');
const getData = (filePath) => parsers(fs.readFileSync(filePath, 'utf8'), path.extname(filePath));

describe.each([
  ['JSON', '__fixtures__/before.json', '__fixtures__/after.json', '__fixtures__/diffStylish'],
  ['YML', '__fixtures__/before.yml', '__fixtures__/after.yml', '__fixtures__/diffStylish'],
  ['INI', '__fixtures__/before.ini', '__fixtures__/after.ini', '__fixtures__/diffStylish'],
])('Stylish', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(path.resolve(before));
    const afterData = getData(path.resolve(after));
    const diff = genDiff(beforeData, afterData);
    const resultData = getResult(path.resolve(result)).trim();
    expect(diff).toBe(resultData);
  });
});

describe.each([
  ['Plain', '__fixtures__/before.json', '__fixtures__/after.json', '__fixtures__/diffPlain'],
])('Plain', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(path.resolve(before));
    const afterData = getData(path.resolve(after));
    const diff = genDiff(beforeData, afterData, 'plain');
    const resultData = getResult(path.resolve(result)).trim();
    expect(diff).toBe(resultData);
  });
});

describe.each([
  ['JSON', '__fixtures__/before.json', '__fixtures__/after.json', '__fixtures__/diffJson'],
])('json', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(path.resolve(before));
    const afterData = getData(path.resolve(after));
    const diff = genDiff(beforeData, afterData, 'json');
    const resultData = getResult(path.resolve(result)).trim();
    expect(diff).toBe(resultData);
  });
});
