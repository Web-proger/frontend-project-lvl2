import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import formatters from './formatters';
import parse from './parsers';

const getDiffStructure = (dataBefore, dataAfter) => {
  const keys = _.union(_.keys(dataBefore), _.keys(dataAfter)).sort();

  return keys.map((key) => {
    const hasKeyBefore = _.has(dataBefore, key);
    const hasKeyAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];
    const children = (_.isObject(beforeValue) && _.isObject(afterValue))
      ? getDiffStructure(beforeValue, afterValue)
      : [];

    const getStatus = () => {
      if (hasKeyBefore && hasKeyAfter) {
        return beforeValue === afterValue ? 'unmodified' : 'modified';
      }
      return beforeValue ? 'deleted' : 'added';
    };

    return {
      key,
      status: getStatus(),
      beforeValue,
      afterValue,
      children,
    };
  });
};

const getExtname = (filePath) => path.extname(filePath).split('.')[1] || '';

export default (firstConfig, secondConfig, formatType = 'stylish') => {
  const oldFilepath = path.resolve(firstConfig);
  const newFilepath = path.resolve(secondConfig);

  const oldExtname = getExtname(oldFilepath);
  const newExtname = getExtname(newFilepath);

  const oldData = parse(fs.readFileSync(oldFilepath, 'utf8'), oldExtname);
  const newData = parse(fs.readFileSync(newFilepath, 'utf8'), newExtname);

  const diff = getDiffStructure(oldData, newData);
  const format = formatters(formatType);

  return format(diff);
};
