import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parser from './parser';

export default (path1, path2) => {
  let diff = '';
  const beforeData = fs.readFileSync(path1, 'utf8');
  const afterData = fs.readFileSync(path2, 'utf8');

  const before = parser(beforeData, path.extname(path1));
  const after = parser(afterData, path.extname(path2));

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

  keys.forEach((key) => {
    const isBefore = _.has(before, key);
    const isAfter = _.has(after, key);
    const beforeValue = before[key];
    const afterValue = after[key];

    if (isBefore && isAfter) {
      if (beforeValue === afterValue) {
        diff = diff.concat(`  ${key}: ${beforeValue}\n`);
      } else {
        diff = diff.concat(`- ${key}: ${beforeValue}\n+ ${key}: ${afterValue}\n`);
      }
    } else if (isBefore) {
      diff = diff.concat(`- ${key}: ${beforeValue}\n`);
    } else {
      diff = diff.concat(`+ ${key}: ${afterValue}\n`);
    }
  });

  return diff;
};
