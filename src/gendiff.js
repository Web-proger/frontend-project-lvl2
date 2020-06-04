import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import formatter from './formatters';
import parsers from './parsers';

// Получаем структуру дифа
const getStructure = (dataBefore, dataAfter) => {
  const keys = [...new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)])].sort();

  return keys.reduce((acc, key) => {
    const isBefore = _.has(dataBefore, key);
    const isAfter = _.has(dataAfter, key);
    const beforeValue = dataBefore[key];
    const afterValue = dataAfter[key];

    const item = {
      available: '',
      equal: null,
    };

    if (isBefore && isAfter) {
      if (typeof beforeValue === 'object' && typeof afterValue === 'object') {
        acc[key] = getStructure(beforeValue, afterValue);
        return acc;
      }

      item.available = 'both';
      item.equal = beforeValue === afterValue;
    } else {
      item.available = isBefore ? 'before' : 'after';
    }
    acc[key] = item;

    return acc;
  }, {});
};

export default (firstConfig, secondConfig, format = 'stylish') => {
  const path1 = path.resolve(firstConfig);
  const path2 = path.resolve(secondConfig);
  const dataBefore = parsers(fs.readFileSync(path1, 'utf8'), path.extname(path1));
  const dataAfter = parsers(fs.readFileSync(path2, 'utf8'), path.extname(path2));

  const structure = getStructure(dataBefore, dataAfter);
  return formatter(dataBefore, dataAfter, structure, format);
};
