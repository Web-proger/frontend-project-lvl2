import { expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import genDiff from '../src/gendiff';

const getAbsPath = (fileName) => path.join(process.cwd(), '__fixtures__', fileName);

test.each([
  ['stylish', 'JSON', 'before.json', 'after.json', 'diffStylish'],
  ['stylish', 'YML', 'before.yml', 'after.yml', 'diffStylish'],
  ['stylish', 'INI', 'before.ini', 'after.ini', 'diffStylish'],
  ['plain', 'JSON', 'before.json', 'after.json', 'diffPlain'],
  ['json', 'JSON', 'before.json', 'after.json', 'diffJson'],
])('[Format: %s, File type: %s])', (format, dataType, before, after, result) => {
  const beforePath = getAbsPath(before);
  const afterPath = getAbsPath(after);
  const resultData = fs.readFileSync(getAbsPath(result), 'utf-8').trim();
  const diff = genDiff(beforePath, afterPath, format);

  expect(diff).toBe(resultData);
});
