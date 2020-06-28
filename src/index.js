import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import formatters from './formatters';
import parse from './parsers';

const getStructure = (dataBefore, dataAfter) => {
  const keys = _.union(_.keys(dataBefore), _.keys(dataAfter)).sort();

  return keys.map((key) => {
    const hasKeyBefore = _.has(dataBefore, key);
    const hasKeyAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];
    const children = (_.isObject(beforeValue) && _.isObject(afterValue))
      ? getStructure(beforeValue, afterValue)
      : [];

    const getStatus = () => {
      if (hasKeyBefore && hasKeyAfter) {
        return 'modified';
      }
      return beforeValue ? 'deleted' : 'added';
    };

    return {
      key,
      status: getStatus(),
      equal: beforeValue === afterValue,
      beforeValue,
      afterValue,
      children,
    };
  });
};

const getExtname = (filePath) => path.extname(filePath).split('.')[1] || '';

export default (firstConfig, secondConfig, formatType = 'stylish') => {
  const beforePath = path.resolve(firstConfig);
  const afterPath = path.resolve(secondConfig);

  const beforeExtname = getExtname(beforePath);
  const afterExtname = getExtname(afterPath);

  const dataBefore = parse(fs.readFileSync(beforePath, 'utf8'), beforeExtname);
  const dataAfter = parse(fs.readFileSync(afterPath, 'utf8'), afterExtname);

  const structure = getStructure(dataBefore, dataAfter);
  const formatter = formatters(formatType);

  return formatter(structure);
};
