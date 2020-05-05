import path from 'path';
import genDiff from '../src/gendiff';

test('genDiff', () => {
  const pwd = process.cwd();
  const currentPath1 = 'fixtures/before.json';
  const currentPath2 = 'fixtures/after.json';
  const path1 = path.join(pwd, currentPath1);
  const path2 = path.join(pwd, currentPath2);

  const result = '  host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true\n';
  expect(genDiff(path1, path2)).toBe(result);
});
