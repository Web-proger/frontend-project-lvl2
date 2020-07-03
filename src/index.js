import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import formatters from './formatters';
import parse from './parsers';
import util from 'util';

const getStructure = (node) => Object.entries(node).map(([key, value]) => {
  const type = _.isObject(value) ? 'composite' : 'simple';
  const children = _.isObject(value) ? getStructure(value) : [];

  if (type === 'composite') {
    return {
      key,
      type,
      children,
    };
  }

  return {
    key,
    type,
    value,
  };
});

const getDiffStructure = (dataBefore, dataAfter) => {
  const keys = _.union(_.keys(dataBefore), _.keys(dataAfter)).sort();

  return keys.map((key) => {
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];
    const hasKeyBoth = _.has(dataBefore, key) && _.has(dataAfter, key);
    const valueEqual = hasKeyBoth && (beforeValue === afterValue);


    if (hasKeyBoth) {
      return {
        key,
        status: valueEqual ? 'unmodified' : 'modified',
        nodeBefore: {
          type: beforeType,
          value: beforeValue,
          children,
        },
        nodeAfter: {
          type: afterType,
          value: afterValue,
          children,
        },
      };
    }

    if (valueEqual) {

    }

    return {
      key,
      type: 'simple',
      status: beforeValue ? 'deleted' : 'added',
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

  const beforeStructure = getStructure(oldData);
  const afterStructure = getStructure(newData);

  const format = formatters(formatType);
  //const diff = getDiffStructure(beforeStructure, afterStructure);

  //return format(diff);


  console.log(util.inspect(beforeStructure, { depth: 20 }));
  console.log(util.inspect(afterStructure, { depth: 20 }));
};
