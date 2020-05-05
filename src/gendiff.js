import fs from 'fs';
import _ from 'lodash';

export default (path1, path2) => {
  let diff = '';
  const before = JSON.parse(fs.readFileSync(path1, 'utf8'));
  const after = JSON.parse(fs.readFileSync(path2, 'utf8'));

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of keys) {
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
    } else {
      if (isBefore) {
        diff = diff.concat(`- ${key}: ${beforeValue}\n`);
      } else {
        diff = diff.concat(`+ ${key}: ${afterValue}\n`);
      }
    }
  }

  return diff;
};
