import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parsers from './parsers';

export default (path1, path2) => {
  let diff = '';

  const dataBefore = parsers(fs.readFileSync(path1, 'utf8'), path.extname(path1));
  const dataAfter = parsers(fs.readFileSync(path2, 'utf8'), path.extname(path2));

  const keys = new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)]);

  keys.forEach((key) => {
    const isBefore = _.has(dataBefore, key);
    const isAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];

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
