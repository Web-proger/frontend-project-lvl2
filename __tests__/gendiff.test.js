import genDiff from '../src/gendiff';

test('genDiff', () => {
  const path1 = '/home/tim/my_project/testfile/before.json';
  const path2 = '/home/tim/my_project/testfile/after.json';
  const result = '  host: hexlet.io\n- timeout: 50\n+ timeout: 20\n- proxy: 123.234.53.22\n- follow: false\n+ verbose: true\n';
  expect(genDiff(path1, path2)).toBe(result);
});
