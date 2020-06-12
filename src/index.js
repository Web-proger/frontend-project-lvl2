import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import format from './formatters';
import getJson from './parsers';

// Получаем структуру дифа
const getStructure = (dataBefore, dataAfter) => {
  const keys = _.union(_.keys(dataBefore), _.keys(dataAfter)).sort();

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

// Получаем расширение файла
const getExt = (filePath) => path.extname(filePath).split('.')[1] || '';

export default (firstConfig, secondConfig, formatType = 'stylish') => {
  // Обсалютные пути до конфигов
  const beforePath = path.resolve(firstConfig);
  const afterPath = path.resolve(secondConfig);
  // Расширения файлов конфигов
  const beforeExt = getExt(beforePath);
  const afterExt = getExt(afterPath);

  // Данные из конфигов в виде JSON
  const dataBefore = getJson(fs.readFileSync(beforePath, 'utf8'), beforeExt);
  const dataAfter = getJson(fs.readFileSync(afterPath, 'utf8'), afterExt);

  const structure = getStructure(dataBefore, dataAfter);
  return format(dataBefore, dataAfter, structure, formatType);
};
