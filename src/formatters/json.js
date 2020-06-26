import _ from 'lodash';

// Получаем отображение элементов, которые уже не нужно сравнивать
const getValue = (data) => {
  const convertToString = (obj) => Object.entries(obj).flatMap(([key, value]) => `"${key}":${getValue(value)}`);

  if (_.isObject(data)) {
    return `{${convertToString(data)}}`;
  }
  return _.isString(data) ? `"${data}"` : data;
};

// Формируем строку для визуального отображения diff
const json = (structure) => structure
  .flatMap(({
    key,
    available,
    equal,
    children,
    beforeValue,
    afterValue,
  }, i, arr) => {
    const lastSymbol = arr.length - 1 === i ? '' : ',';
    if (children.length > 0) {
      return [`"${key}":{`, json(children), '}', lastSymbol];
    }

    const beforeTextValue = getValue(beforeValue);
    const afterTextValue = getValue(afterValue);

    switch (available) {
      case 'before':
        return [`"${key}":{`, '"status":"deleted",', `"oldValue":${beforeTextValue}}`, lastSymbol];
      case 'after':
        return [`"${key}":{`, '"status":"added",', `"newValue":${afterTextValue}}`, lastSymbol];
      case 'both':
        return (equal === false) ? [`"${key}":{`, '"status":"changed",', `"oldValue":${beforeTextValue},`, `"newValue":${afterTextValue}}`, lastSymbol] : [];
      default:
        return [];
    }
  }).join('');

export default (structure) => {
  const diff = json(structure);
  return `{${diff}}`;
};
