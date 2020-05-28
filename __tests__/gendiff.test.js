import { test, expect, describe } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';
import parsers from '../src/parsers';

// TODO вынести в отдельный модуль, тестирование parser
// TODO Сделать общиай тест, где будут всё модули за раз
const pwd = process.cwd();
const getPath = (currentPath) => path.join(pwd, currentPath);
const getResult = (resultPath) => fs.readFileSync(resultPath, 'utf-8');
const getData = (filePath) => parsers(fs.readFileSync(filePath, 'utf8'), path.extname(filePath));

describe.each([
  ['JSON', '__fixtures__/before.json', '__fixtures__/after.json', '__fixtures__/resultDiff'],
  ['YML', '__fixtures__/before.yml', '__fixtures__/after.yml', '__fixtures__/resultDiff'],
  ['INI', '__fixtures__/before.ini', '__fixtures__/after.ini', '__fixtures__/resultDiff'],
  ['JSON-TREE', '__fixtures__/treeBefore.json', '__fixtures__/treeAfter.json', '__fixtures__/treeJsonDiff'],
])('Stylish', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(getPath(before));
    const afterData = getData(getPath(after));
    const diff = genDiff(beforeData, afterData);
    const resultData = getResult(getPath(result)).trim();
    expect(diff).toBe(resultData);
  });
});

describe.each([
  ['JSON-TREE', '__fixtures__/treeBefore.json', '__fixtures__/treeAfter.json', '__fixtures__/plainJsonDiff'],
])('Plain', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(getPath(before));
    const afterData = getData(getPath(after));
    const diff = genDiff(beforeData, afterData, 'plain');
    const resultData = getResult(getPath(result)).trim();
    expect(diff).toBe(resultData);
  });
});

describe.each([
  ['JSON-TREE', '__fixtures__/treeBefore.json', '__fixtures__/treeAfter.json', '__fixtures__/resultJsonView'],
])('json', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(getPath(before));
    const afterData = getData(getPath(after));
    const diff = genDiff(beforeData, afterData, 'json');
    const resultData = getResult(getPath(result)).trim();
    expect(diff).toBe(resultData);
  });
});
