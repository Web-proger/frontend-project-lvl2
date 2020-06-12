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

// Получаем расширение файла
const getExt = (filePath) => path.extname(filePath).split('.')[1] || '';

export default (firstConfig, secondConfig, format = 'stylish') => {
  // Обсалютные пути до конфигов
  const beforePath = path.resolve(firstConfig);
  const afterPath = path.resolve(secondConfig);
  // Расширения файлов конфигов
  const beforeExt = getExt(beforePath);
  const afterExt = getExt(afterPath);

  // Данные из конфигов в виде JSON
  const dataBefore = parsers(fs.readFileSync(beforePath, 'utf8'), beforeExt);
  const dataAfter = parsers(fs.readFileSync(afterPath, 'utf8'), afterExt);

  const structure = getStructure(dataBefore, dataAfter);
  return formatter(dataBefore, dataAfter, structure, format);
};
