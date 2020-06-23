import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import format from './formatters';
import getJson from './parsers';

// Получаем структуру дифа
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

    const getAvailable = () => {
      if (hasKeyBefore && hasKeyAfter) {
        return 'both';
      }
      return beforeValue ? 'before' : 'after';
    };

    const available = getAvailable();

    return {
      key,
      available,
      equal: beforeValue === afterValue,
      children,
    };
  });
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
