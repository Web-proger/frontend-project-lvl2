import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import formatters from './formatters';
import parse from './parsers';

const getDiffStructure = (dataBefore, dataAfter) => {
  const keys = _.union(_.keys(dataBefore), _.keys(dataAfter)).sort();
  const getType = (value) => (_.isObject(value) ? 'composite' : 'simple');

  return keys.map((key) => {
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];
    const beforeType = getType(beforeValue);
    const afterType = getType(afterValue);
    const hasKeyBoth = _.has(dataBefore, key) && _.has(dataAfter, key);
    const valueEqual = hasKeyBoth && (beforeValue === afterValue);
    const bothObject = _.isObject(beforeValue) && _.isObject(afterValue);

    if (bothObject) {
      const children = getDiffStructure(beforeValue, afterValue);
      return {
        key,
        type: 'composite',
        children,
      };
    }

    if (valueEqual) {
      return {
        key,
        type: 'simple',
        status: 'unmodified',
        nodeBefore: {
          type: beforeType,
          value: beforeValue,
        },
        nodeAfter: {
          type: afterType,
          value: afterValue,
        },
      };
    }

    if (hasKeyBoth) {
      return {
        key,
        type: 'simple',
        status: 'modified',
        nodeBefore: {
          type: beforeType,
          value: beforeValue,
        },
        nodeAfter: {
          type: afterType,
          value: afterValue,
        },
      };
    }

    return {
      key,
      type: 'simple',
      status: beforeValue ? 'deleted' : 'added',
      nodeBefore: {
        type: beforeType,
        value: beforeValue,
      },
      nodeAfter: {
        type: afterType,
        value: afterValue,
      },
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

  const format = formatters(formatType);
  const diff = getDiffStructure(oldData, newData);

  return format(diff);
};
