import _ from 'lodash';
// Получаем отображение элементов, которые уже не нужно сравнивать
const objToStr = (obj, depth) => {
  const string = Object.keys(obj).reduce((acc, key) => {
    const value = _.isObject(obj[key]) ? objToStr(obj[key], depth + 1) : obj[key];
    return acc.concat(`${'    '.repeat(depth)}    ${key}: ${value}\n`);
  }, '');
  return `{\n${string}${'    '.repeat(depth)}}`;
};

const getValue = (value, depth) => (_.isObject(value) ? objToStr(value, depth) : value);
const indent = (depth) => '    '.repeat(depth);

// Формируем строку для визуального отображения diff
const stylish = (dataBefore, dataAfter, structure, depth) => structure
  .reduce((acc, [keyName, available, equal, children]) => {
    const beforeVal = dataBefore[keyName];
    const afterVal = dataAfter[keyName];

    if (children.length > 0) {
      return acc.concat(`${indent(depth + 1)}${keyName}: {\n${stylish(beforeVal, afterVal, children, depth + 1)}${indent(depth + 1)}}\n`);
    }

    switch (available) {
      case 'before':
        return acc.concat(`${indent(depth)}  - ${keyName}: ${getValue(beforeVal, depth + 1)}\n`);
      case 'after':
        return acc.concat(`${indent(depth)}  + ${keyName}: ${getValue(afterVal, depth + 1)}\n`);
      case 'both':
        if (equal === true) {
          return acc.concat(`${indent(depth + 1)}${keyName}: ${beforeVal}\n`);
        }
        return acc.concat(`${indent(depth)}  - ${keyName}: ${getValue(beforeVal, depth + 1)}\n${indent(depth)}  + ${keyName}: ${getValue(afterVal, depth + 1)}\n`);
      default:
        return acc;
    }
  }, '');

export default (bef, aft, str, d = 0) => {
  const diff = stylish(bef, aft, str, d).trimRight();
  return `{\n${diff}\n}`;
};
