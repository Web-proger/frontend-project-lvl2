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
    const bothObject = _.isObject(beforeValue) && _.isObject(afterValue);

    if (bothObject) {
      const children = getDiffStructure(beforeValue, afterValue);
      return {
        key,
        type: 'withSubstructure',
        children,
      };
    }

    if (valueEqual) {
      return {
        key,
        type: 'unmodified',
        beforeValue,
        afterValue,
      };
    }

    if (hasKeyBoth) {
      return {
        key,
        type: 'modified',
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

export default (firstConfig, secondConfig, formatType = 'stylish') => {
  const oldFilepath = path.resolve(firstConfig);
  const newFilepath = path.resolve(secondConfig);

  const oldExtname = getExtname(oldFilepath);
  const newExtname = getExtname(newFilepath);

  const oldData = parse(fs.readFileSync(oldFilepath, 'utf8'), oldExtname);
  const newData = parse(fs.readFileSync(newFilepath, 'utf8'), newExtname);

  const format = getFormatter(formatType);
  const diff = getDiffStructure(oldData, newData);

  return format(diff);
};
