import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import getFormatter from './formatters';
import parse from './parsers';

const getDiffStructure = (dataBefore, dataAfter) => {
  const keys = _.union(_.keys(dataBefore), _.keys(dataAfter)).sort();

  return keys.map((key) => {
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];
    const hasKeyBoth = _.has(dataBefore, key) && _.has(dataAfter, key);
    const valueEqual = hasKeyBoth && (beforeValue === afterValue);
    const withSubstructure = _.isObject(beforeValue) && _.isObject(afterValue);

    if (withSubstructure) {
      const children = getDiffStructure(beforeValue, afterValue);
      return {
        key,
        type: 'withSubstructure',
        children,
      };
    }

    if (hasKeyBoth) {
      return {
        key,
        type: valueEqual ? 'unmodified' : 'modified',
        beforeValue,
        afterValue,
      };
    }

    return {
      key,
      type: beforeValue ? 'deleted' : 'added',
      beforeValue,
      afterValue,
    };
  });
};

const getExtname = (filePath) => path.extname(filePath).slice(1);

export default (oldFilePath, newFilePath, formatType = 'stylish') => {
  const oldAbsFilepath = path.resolve(oldFilePath);
  const newAbsFilepath = path.resolve(newFilePath);

  const oldExtname = getExtname(oldAbsFilepath);
  const newExtname = getExtname(newAbsFilepath);

  const oldData = parse(fs.readFileSync(oldAbsFilepath, 'utf8'), oldExtname);
  const newData = parse(fs.readFileSync(newAbsFilepath, 'utf8'), newExtname);

  const format = getFormatter(formatType);
  const diff = getDiffStructure(oldData, newData);

  return format(diff);
};
