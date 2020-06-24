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
  .map(({
    key,
    available,
    equal,
    children,
  }) => {
    const beforeVal = dataBefore[key];
    const afterVal = dataAfter[key];

    if (children.length > 0) {
      return `${indent(depth + 1)}${key}: {\n${stylish(beforeVal, afterVal, children, depth + 1)}${indent(depth + 1)}}\n`;
    }

    switch (available) {
      case 'before':
        return `${indent(depth)}  - ${key}: ${getValue(beforeVal, depth + 1)}\n`;
      case 'after':
        return `${indent(depth)}  + ${key}: ${getValue(afterVal, depth + 1)}\n`;
      case 'both':
        if (equal === true) {
          return `${indent(depth + 1)}${key}: ${beforeVal}\n`;
        }
        return `${indent(depth)}  - ${key}: ${getValue(beforeVal, depth + 1)}\n${indent(depth)}  + ${key}: ${getValue(afterVal, depth + 1)}\n`;
      default:
        return '';
    }
  })
  .join('');

export default (bef, aft, str, d = 0) => {
  const diff = stylish(bef, aft, str, d).trimRight();
  return `{\n${diff}\n}`;
};
