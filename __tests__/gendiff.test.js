import { test, expect, describe } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';
import parsers from '../src/parsers';
import stylish from '../src/stylish';

// TODO вынести в отдельный модуль, тестирование parser
// TODO Сделать общай тест, где будут всё модули за раз
const pwd = process.cwd();
const getPath = (currentPath) => path.join(pwd, currentPath);
const getResult = (resultPath) => fs.readFileSync(resultPath, 'utf-8');
const getData = (filePath) => parsers(fs.readFileSync(filePath, 'utf8'), path.extname(filePath));

describe.each([
  ['JSON', '__fixtures__/json/before.json', '__fixtures__/json/after.json', '__fixtures__/json/resultJsonDiff'],
  ['YML', '__fixtures__/yml/before.yml', '__fixtures__/yml/after.yml', '__fixtures__/yml/resultYmlDiff'],
  ['INI', '__fixtures__/ini/before.ini', '__fixtures__/ini/after.ini', '__fixtures__/ini/resultIniDiff'],
  ['JSON-TREE', '__fixtures__/json/treeBefore.json', '__fixtures__/json/treeAfter.json', '__fixtures__/json/treeJsonDiff'],
])('config diff', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(getPath(before));
    const afterData = getData(getPath(after));
    const resultData = getResult(getPath(result));
    const internalView = genDiff(beforeData, afterData);
    const diff = `{\n${stylish(beforeData, afterData, internalView).trimRight()}\n}`;
    expect(diff).toBe(resultData.trim());
  });
});
