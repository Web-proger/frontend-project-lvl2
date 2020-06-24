import _ from 'lodash';

const getIndent = (depth) => '    '.repeat(depth);

// Получаем отображение элементов, которые уже не нужно сравнивать
const objToStr = (obj, depth) => {
  const indent = getIndent(depth);

  const string = Object.keys(obj).map((key) => {
    const value = _.isObject(obj[key]) ? objToStr(obj[key], depth + 1) : obj[key];
    return `${indent}    ${key}: ${value}\n`;
  }, '');
  return `{\n${string}${indent}}`;
};

const getValue = (value, depth) => (_.isObject(value) ? objToStr(value, depth) : value);

// Формируем строку для визуального отображения diff
const stylish = (structure, depth) => structure
  .map(({
    key,
    available,
    equal,
    children,
    beforeValue,
    afterValue,
  }) => {
    const indent = getIndent(depth);
    const beforeTextValue = getValue(beforeValue, depth + 1);
    const afterTextValue = getValue(afterValue, depth + 1);

    if (children.length > 0) {
      return `${indent}    ${key}: {\n${stylish(children, depth + 1)}${indent}    }\n`;
    }

    switch (available) {
      case 'before':
        return `${indent}  - ${key}: ${beforeTextValue}\n`;
      case 'after':
        return `${indent}  + ${key}: ${afterTextValue}\n`;
      case 'both':
        if (equal === true) {
          return `${indent}    ${key}: ${beforeValue}\n`;
        }
        return `${indent}  - ${key}: ${beforeTextValue}\n${indent}  + ${key}: ${afterTextValue}\n`;
      default:
        return '';
    }
  })
  .join('');

export default (str) => {
  const diff = stylish(str, 0).trimRight();
  return `{\n${diff}\n}`;
};
