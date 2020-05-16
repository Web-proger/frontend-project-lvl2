import { test, expect, describe } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';
import parsers from '../src/parsers';

// TODO вынести в отдельный модуль, тестирование parser
// TODO Сделать общай тест, где будут всё модули за раз
const pwd = process.cwd();
const getPath = (currentPath) => path.join(pwd, currentPath);
const getResult = (resultPath) => fs.readFileSync(resultPath, 'utf-8');
const getData = (filePath) => parsers(fs.readFileSync(filePath, 'utf8'), path.extname(filePath));

describe.each([
  ['JSON', 'fixtures/json/before.json', 'fixtures/json/after.json', 'fixtures/json/resultJsonDiff'],
  ['YML', 'fixtures/yml/before.yml', 'fixtures/yml/after.yml', 'fixtures/yml/resultYmlDiff'],
  ['INI', 'fixtures/ini/before.ini', 'fixtures/ini/after.ini', 'fixtures/ini/resultIniDiff'],
])('config diff', (name, before, after, result) => {
  test(name, () => {
    const beforeData = getData(getPath(before));
    const afterData = getData(getPath(after));
    const resultData = getResult(getPath(result));
    expect(genDiff(beforeData, afterData).trim()).toBe(resultData.trim());
  });
});
